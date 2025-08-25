from flask import Flask, jsonify, request, send_from_directory
import os
from agent import PythonTestingAgent

agent = PythonTestingAgent()

app = Flask(__name__)

# Check if we should serve the new UI
USE_NEW_UI = os.environ.get('USE_NEW_UI', 'false').lower() == 'true'

@app.route('/')
def home():
    if USE_NEW_UI:
        return send_from_directory('ui/dist', 'index.html')
    else:
        return send_from_directory('.', 'index.html')

# Serve static files for new UI
@app.route('/<path:filename>')
def serve_static(filename):
    if USE_NEW_UI and os.path.exists(f'ui/dist/{filename}'):
        return send_from_directory('ui/dist', filename)
    elif not USE_NEW_UI and filename in ['naver7d3842db79066fa31723b07a3a5ff459.html']:
        return send_from_directory('.', filename)
    else:
        # Try to serve from ui/dist for new UI assets
        if USE_NEW_UI:
            return send_from_directory('ui/dist', filename)
        else:
            return "File not found", 404

@app.route('/naver7d3842db79066fa31723b07a3a5ff459.html')
def naver():
    return send_from_directory('.', 'naver7d3842db79066fa31723b07a3a5ff459.html')

# API routes for both old and new UI
@app.route('/health')
@app.route('/api/health')
def health():
    return jsonify({"status": "healthy"})

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
