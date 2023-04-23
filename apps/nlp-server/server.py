from flask import Flask, request, jsonify
from ai import generate_context, get_data
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/topics', methods=['POST'])
def get_topics():
    data = request.get_json()
    response = {}
    if not data['solution']:
      return jsonify({"MESSAGE": "post_log: problems with request parameters"}), 400
    try:
        neighbors = generate_context(data['solution'])
        response["RESULT"] = neighbors
        # print(neighbors)
        status = 200
    except Exception as e:
        print(f"Exception: {e}")
        response["MESSAGE"] = f"Exception: {e}"
        status = 500
    return jsonify(response), status

@app.route('/data', methods=['GET'])
def get_nlp_data():
    headers = dict(request.headers)
    # check for api key
    # get class_id
    response = {}
    try:
        data = get_data(1)
        response["RESULT"] = data
        status = 200
    except Exception as e:
        print(f"Exception {e}")
        response["MESSAGE"] = f"Exception: {e}"
        status = 500
    return jsonify(response), status
    


@app.route('/message', methods=['POST'])
def post_message():
    return jsonify({"RESULT": "HELLO"}), 200


if __name__ == '__main__':
    app.run(port=6363, debug=True)
