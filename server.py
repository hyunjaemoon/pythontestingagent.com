from flask import Flask, abort, jsonify, request, send_from_directory
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.middleware.proxy_fix import ProxyFix
import os
from agent import PythonTestingAgent

agent = PythonTestingAgent()

app = Flask(__name__)

# Cap inbound JSON at 64 KB. The rate limit defends against burst count;
# this defends each call's payload size. Without it, a single in-quota
# request can ship megabytes of "code" to Gemini and blow token cost.
MAX_BODY_BYTES = 64 * 1024
app.config['MAX_CONTENT_LENGTH'] = MAX_BODY_BYTES


@app.before_request
def _enforce_body_size():
    # Belt-and-suspenders: Flask 3 / Werkzeug 3 has not been entirely
    # reliable about enforcing MAX_CONTENT_LENGTH for every request shape,
    # so we also check Content-Length up front. Aborts with 413 before any
    # body is read or any rate-limit slot is spent on a giant payload.
    if request.method in ('POST', 'PUT', 'PATCH'):
        length = request.content_length
        if length is not None and length > MAX_BODY_BYTES:
            abort(413)


@app.errorhandler(413)
def too_large_handler(e):
    resp = jsonify({
        "error": "payload_too_large",
        "message": f"Request body exceeded the {MAX_BODY_BYTES // 1024} KB limit.",
    })
    resp.status_code = 413
    return resp

# Trust the first proxy hop so Flask-Limiter keys by the real client IP
# (Cloud Run / load balancers set X-Forwarded-For). Bump x_for if more
# proxies are added in front (e.g. Cloudflare -> Cloud Run = x_for=2).
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

# Per-IP layered rate limits applied per-action-endpoint. Cheap reads
# like /health stay exempt. Hits any window -> 429.
ACTION_RATE_LIMITS = "5 per 10 seconds; 30 per minute; 200 per day"

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    storage_uri="memory://",
    headers_enabled=True,
)


@app.errorhandler(429)
def ratelimit_handler(e):
    resp = jsonify({
        "error": "rate_limited",
        "message": "You're going too fast. Please wait a moment and try again.",
    })
    resp.status_code = 429
    return resp


@app.route('/')
def home():
    return send_from_directory('ui/dist', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('ui/dist', filename)

@app.route('/naver7d3842db79066fa31723b07a3a5ff459.html')
def naver():
    return send_from_directory('.', 'naver7d3842db79066fa31723b07a3a5ff459.html')

# API routes for both old and new UI
HEALTH_CORS_ORIGINS = {'https://moonai.kr', 'https://moonai.co.kr'}

@app.route('/health')
@app.route('/api/health')
@limiter.exempt
def health():
    resp = jsonify({"status": "healthy"})
    resp.headers['Vary'] = 'Origin'
    origin = request.headers.get('Origin')
    if origin in HEALTH_CORS_ORIGINS:
        resp.headers['Access-Control-Allow-Origin'] = origin
    return resp

def _normalized_lang(value):
    return value if value in ('en', 'ko') else 'en'

@app.route('/generate-question', methods=['POST'])
@app.route('/api/generate-question', methods=['POST'])
@limiter.limit(ACTION_RATE_LIMITS)
def generate_question():
    data = request.json or {}
    lang = _normalized_lang(data.get('lang'))
    question = agent.generate_question(data.get('topic'), lang=lang)
    return jsonify({"question": question})

@app.route('/grade', methods=['POST'])
@app.route('/api/grade', methods=['POST'])
@limiter.limit(ACTION_RATE_LIMITS)
def grade():
    data = request.json or {}
    code = data.get('code')
    question = data.get('question')
    lang = _normalized_lang(data.get('lang'))
    grade = agent.grade(code, question, lang=lang)
    return jsonify({"grade": grade})

@app.route('/youtube-suggestions', methods=['POST'])
@app.route('/api/youtube-suggestions', methods=['POST'])
@limiter.limit(ACTION_RATE_LIMITS)
def youtube_suggestions():
    data = request.json or {}
    question = (data.get('question') or '').strip()
    lang = data.get('lang') or 'en'
    if not question:
        return jsonify({"error": "missing_question"}), 400
    if lang not in ('en', 'ko'):
        lang = 'en'
    result = agent.suggest_youtube_searches(question, lang=lang)
    if isinstance(result, dict) and result.get('error'):
        return jsonify(result), 502
    return jsonify(result)

if __name__ == '__main__':
    # Production runs gunicorn (see Dockerfile). This entry point is for local
    # dev only. Debug is opt-in via FLASK_DEBUG=1 so that an accidental
    # `python server.py` in a deployed container never exposes the Werkzeug
    # interactive debugger.
    port = int(os.environ.get('PORT', 8080))
    debug = os.environ.get('FLASK_DEBUG') == '1'
    app.run(host='0.0.0.0', port=port, debug=debug)
