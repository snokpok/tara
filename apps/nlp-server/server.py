from flask import Flask, request, jsonify
from ai import get_data, update_frequency_tracker, classify_message
from flask_cors import CORS
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:4200"]}})

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/topics', methods=['POST'])
def get_topics():
    data = request.get_json()
    response = {}
    if not data['solution'] or not data['class_id']:
      return jsonify({"message": "post_log: problems with request parameters"}), 400
    try:
        neighbors = update_frequency_tracker(data['solution'], data['class_id'])
        response["message"] = neighbors
        # print(neighbors)
        status = 200
    except Exception as e:
        print(f"Exception: {e}")
        response["message"] = f"Exception: {e}"
        status = 500
    return jsonify(response), status

@app.route('/data', methods=['GET'])
def get_nlp_data():
    response = {}
    try:
        data = get_data(8)
        response["result"] = data
        status = 200
    except Exception as e:
        print(f"Exception {e}")
        response["message"] = f"Exception: {e}"
        status = 500
    return jsonify(response), status

    


@app.route('/message', methods=['POST'])
def post_message():
    data = request.get_json()
    response = {}
    status_code = 200
    if not data['message'] or not data['class_id']:
        return jsonify({"message": "post_log: problems with request parameters"}), 400
    try:
        classify_message(data['class_id'], data['message'])
        response['message'] = 'success'
    except Exception as e:
        response['message'] = e
        status_code = 500
    return jsonify(response), status_code


if __name__ == '__main__':
    app.run(port=6363, debug=True)
