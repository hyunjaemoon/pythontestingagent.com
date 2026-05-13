from flask import Flask, jsonify, request, send_from_directory
import os
from agent import PythonTestingAgent

agent = PythonTestingAgent()

app = Flask(__name__)

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
def health():
    resp = jsonify({"status": "healthy"})
    resp.headers['Vary'] = 'Origin'
    origin = request.headers.get('Origin')
    if origin in HEALTH_CORS_ORIGINS:
        resp.headers['Access-Control-Allow-Origin'] = origin
    return resp

@app.route('/generate-question', methods=['POST'])
@app.route('/api/generate-question', methods=['POST'])
def generate_question():
    data = request.json
    question = agent.generate_question(data.get('topic'))
    return jsonify({"question": question})

@app.route('/grade', methods=['POST'])
@app.route('/api/grade', methods=['POST'])
def grade():
    data = request.json
    code = data.get('code')
    question = data.get('question')
    grade = agent.grade(code, question)
    return jsonify({"grade": grade})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)
