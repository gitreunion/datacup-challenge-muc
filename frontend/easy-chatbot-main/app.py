from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/', methods=['POST'])
def chatbot_response():
    data = request.get_json()
    user_message = data.get('user_message')
    
    # Simulate a response from the chatbot
    response_message = f"Echo: {user_message}"
    
    return jsonify({'reply': response_message})

if __name__ == '__main__':
    app.run(port=9001, debug=True)