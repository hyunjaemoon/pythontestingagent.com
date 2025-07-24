from flask import Flask, jsonify, request, send_from_directory
import os
from agent import PythonTestingAgent

agent = PythonTestingAgent()

app = Flask(__name__)

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/health')
def health():
    return jsonify({"status": "healthy"})

@app.route('/grade', methods=['POST'])
def grade():
    data = request.json
    code = data.get('code')
    question = data.get('question')
    grade = agent.grade(code, question)
    return jsonify({"grade": grade})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
