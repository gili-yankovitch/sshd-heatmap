#!/usr/bin/python3
from flask import Flask, send_from_directory
from sys import argv
from os import path
from re import compile
from datetime import datetime
from calendar import month_abbr
from pprint import pprint
import maxminddb
app = Flask(__name__)

@app.route("/")
def index():
	return send_from_directory("static", "index.html")

@app.route("/<path:path>")
def serve(path = "index.html"):
	return send_from_directory("static", path)

@app.route("/update")
def update():
	with open("auth.log", "r") as f:
		lines = f.read().split("\n")

	pattern = compile("(?P<MONTH>\w{3})\s(?P<DAY>\d{2})\s(?P<TIME>\d\d:\d\d:\d\d)\s(?P<HOSTNAME>[^\s]+)\ssshd\[\d+\]:\sInvalid user (?P<USERNAME>[^\s]+)\sfrom\s(?P<IP>\d+\.\d+\.\d+\.\d+)")

	# Use libmaxminddb for static geolocation
	reader = maxminddb.open_database("GeoLite2-Country.mmdb")

	stats = {
		"locations": {},
		"users": {}
	}

	for line in lines:
		res = pattern.match(line)
		if res is None:
			continue

		if datetime.now().day - 1 != int(res.group("DAY")) or month_abbr[datetime.now().month] != res.group("MONTH"):
			continue

		location = reader.get(res.group("IP"))["country"]
		country_code = location["iso_code"]
		country_name = location["names"]["en"]

		# Populate statistics dict
		if country_code not in stats["locations"]:
			stats["locations"][country_code] = {
				"code": country_code,
				"name": country_name,
				"value": 0
				}

		stats["locations"][country_code]["value"] += 1

		if res.group("USERNAME") not in stats["users"]:
			stats["users"][res.group("USERNAME")] = 0

		stats["users"][res.group("USERNAME")] += 1

	resp = {"locations": list([ stats["locations"][x] for x in stats["locations"] ]), "users": stats["users"]}
	return resp

if __name__ == '__main__':
	app.run("0.0.0.0", debug = True)
