/**
# ----------------------------------------------------------------------------
# Copyright (c) 2020, Arm Limited and affiliates.
#
# SPDX-License-Identifier: Apache-2.0
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ----------------------------------------------------------------------------
**/

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const request = require('request');
app.use(bodyParser.json());

var myArgs = process.argv.slice(2);
if (myArgs.length < 2) {
	console.log("Must specify a port and a key directory");
	process.exit(1);
}

const port = myArgs[0];
const key_dir = myArgs[1];

let SecureBLE = require('./src/SecureBLE');
let secure_ble = new SecureBLE(key_dir);
secure_ble.init();

if (myArgs.length > 2) {
 	secure_ble.setClientEndpoint(myArgs[2]);
}

// MUTUAL
app.get('/pubkey', (req, res) => {
	res.sendFile(key_dir + '/device.pem', {root: __dirname});
});

app.get('/nonce', (req, res) => {
	res.sendFile(key_dir + '/device.nonce', {root: __dirname});
});

app.get('/snonce', (req, res) => {
	res.sendFile(key_dir + '/client.nonce.signed', {root: __dirname});
});

app.get('/ecdh', (req, res) => {
	res.sendFile(key_dir + '/device.ecdh.pub', {root: __dirname});
});

app.get('/oob', (req, res) => {
	res.sendFile(key_dir + '/device.oob.enc', {root: __dirname});
});

// MUTUAL
function send_oob() {
	request({
		'method': 'GET',
		'url': secure_ble.getClientEndpoint() + '/oob'
	}, function (err, response) {
		secure_ble.decrypt(response.body, function(data) {
			console.log("OOB keys exchanged securely!");
		});
	});
}

// MUTUAL
function trade_aes() {
	request({
		'method': 'GET',
		'url': secure_ble.getClientEndpoint() + '/ecdh'
	}, function (err, response) {
		if (err) throw new Error(err);
		else {
			console.log("Obtained client ECDH public key!");
			secure_ble.writeECDHPubKey(response.body, function() {
				secure_ble.genAES(function(err) {
					if (err) throw new Error(err);
					else {
						console.log("AES symmetric key generated");
						secure_ble.encrypt(function(err) {
							if (err) throw new Error(err);
							else {
								send_oob();
							}
						});
					}
				});
			});
		}
	});
}

// MUTUAL
function verify_nonce() {
	request({
		'method': 'GET',
		'url': secure_ble.getClientEndpoint() + '/snonce'
	}, function (err, response) {
		if (err) throw new Error(err);
		else {
			console.log("Obtained signed nonce!");
			secure_ble.writeSignedNonce(response.body, function() {
				secure_ble.verifyNonce(function(err) {
					if (err) throw new Error(err);
					else {
						console.log("Nonce signature confirmed");
						trade_aes();
					}
				});
			});
		}
	});
}

// MUTUAL
function get_nonce() {
	request({
		'method': 'GET',
		'url': secure_ble.getClientEndpoint() + '/nonce'
	}, function (err, response) {
		if (err) throw new Error(err);
		else {
			console.log("Obtained un-signed nonce!");
			secure_ble.writeClientNonce(response.body, function() {
				secure_ble.signClientNonce(function(err) {
					if (err) throw new Error(err);
					else {
						console.log("Client nonce signed");
						verify_nonce();
					}
				});
			});
		}
	});
}

// MUTUAL
function get_pubkey() {
	request({
		'method': 'GET',
		'url': secure_ble.getClientEndpoint() + '/pubkey'
	}, function (err, response) {
		if (err) throw new Error(err);
		else {
			console.log("Obtained client key!");
			secure_ble.writeClientPubKey(response.body, function() {
				secure_ble.verifyClientKey(function(err) {
					if (err) throw new Error(err);
					else {
						console.log("Certificate Verification confirmed");
						get_nonce();
					}
				});
			});
		}
	});
}

// CLIENT
function authenticate() {
	request({
		'method': 'POST',
		'url': secure_ble.getClientEndpoint() + '/authenticate',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({'endpoint':`http://localhost:${port}`})
	}, function (error, response) {
		if (error) throw new Error(error);
		get_pubkey();
	});
}

// SERVER
app.post('/authenticate', (req, res) => {
 	let content = req.body;
 	secure_ble.setClientEndpoint(content.endpoint);
	res.send("ok");
	get_pubkey();
})

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
	if (secure_ble.getClientEndpoint()) authenticate();
});
