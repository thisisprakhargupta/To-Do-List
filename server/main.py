
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

list = []

# Enable CORS for all routes
CORS(app) 

@app.route('/check')
def home():
    return "Welcome to the Flask API!"

start=0
# Example route: POST API
@app.route('/add', methods=['POST'])
def submit_data():
    data = request.data.decode('utf-8')
    list.append(data)
    return list[start:]

@app.route('/reset', methods=['POST'])
def reset_start():
    global start
    start=len(list)
    return []

app.run(debug=True)