from flask import Flask, send_from_directory
from flask_cors import CORS, cross_origin
from sys import argv
from os import path
from re import compile

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
origins = ['https://127.0.0.1:5000']

@app.route("/")
def index():
	return send_from_directory("static", "index.html")

@app.route("/<path:path>")
def serve(path = "index.html"):
	r = send_from_directory("static", path)
	r.headers.add('Access-Control-Allow-Origin', '*')
	return r

if __name__ == '__main__':
	# app.run("0.0.0.0", debug = True)
	with open("auth.log", "r") as f:
		lines = f.read().split()


