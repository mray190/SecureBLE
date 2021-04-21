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

const fs = require('fs');
const shell = require('shelljs')

module.exports = class SecureBLE {

	constructor(key_dir) {
		this.key_dir = key_dir;

		this.client_endpoint = null;

		this.nonce_size = 256;
		this.oob_randomizer_length = 16;
		this.oob_hash_length = 16;
	}

	genNonce(cb) {
		const arr = new Uint8Array(this.nonce_size);
		for (var i = 0; i < arr.length; i++) {
			arr[i] = Math.floor(Math.random() * 256);
		}
		let nonce = Buffer.from(arr).toString('base64');
		fs.writeFile(this.key_dir + '/device.nonce', nonce, cb);
	}

	genOOB(cb) {
		const arr = new Uint8Array(this.oob_randomizer_length + this.oob_hash_length);
		for (var i = 0; i < arr.length; i++) {
			arr[i] = Math.floor(Math.random() * 256);
		}
		let oob = Buffer.from(arr).toString('base64');
		fs.writeFile(this.key_dir + '/device.oob', oob, cb);
	}

	writeECDHPubKey(pubkey, cb) {
		let client_pubkey = Buffer.from(pubkey, 'utf8');
		this.write(this.key_dir + '/client.ecdh.pub', client_pubkey, cb);
	}

	writeClientPubKey(pubkey, cb) {
		let client_pubkey = Buffer.from(pubkey, 'utf8');
		this.write(this.key_dir + '/client.pem', client_pubkey, cb);
	}

	writeClientNonce(nonce, cb) {
		let client_nonce = Buffer.from(nonce);
		this.write(this.key_dir + '/client.nonce', nonce, cb);
	}

	writeSignedNonce(nonce, cb) {
		let client_nonce = Buffer.from(nonce);
		this.snonce = client_nonce;
		this.write(this.key_dir + '/device.nonce.signed.tmp', nonce, cb);
	}

	genAES(cb) {
		if (shell.exec('bash ./src/aes.sh ' + this.key_dir, {silent: true}).code !== 0) {
			shell.echo('Generating AES shared symmetric key failed');
			shell.exit(1);
			cb(1);
		}
		cb(0);
	}

	verifyClientKey(cb) {
		if (shell.exec('bash ./src/verifyKey.sh ' + this.key_dir, {silent: true}).code !== 0) {
			shell.echo('Verifying key against rootCA failed');
			shell.exit(1);
			cb(1);
		}
		cb(0);
	}

	verifyNonce(cb) {
		if (shell.exec('bash ./src/verifyNonce.sh ' + this.key_dir, {silent: true}).code !== 0) {
			shell.echo('Verifying signed nonce against sent nonce failed');
			shell.exit(1);
			cb(1);
		}
		cb(0);
	}

	signClientNonce(cb) {
		if (shell.exec('bash ./src/signNonce.sh ' + this.key_dir, {silent: true}).code !== 0) {
			shell.echo('Signing client nonce failed');
			shell.exit(1);
			cb(1);
		}
		cb(0);
	}

	rootCA(cb) {
		if (shell.exec('bash ./src/rootCA.sh ' + this.key_dir, {silent: true}).code !== 0) {
			shell.echo('Generating rootCA failed');
			shell.exit(1);
			cb(1);
		}
		cb(0);
	}

	deviceKeys(cb) {
		if (shell.exec('bash ./src/deviceKeys.sh ' + this.key_dir, {silent: true}).code !== 0) {
			shell.echo('Generating device keys failed');
			shell.exit(1);
			cb(1);
		}
		cb(0);
	}

	encrypt(cb) {
		if (shell.exec('bash ./src/encrypt.sh ' + this.key_dir + ' device.oob device.oob.enc', {silent: true}).code !== 0) {
			shell.echo('Encrypting OOB keys failed');
			shell.exit(1);
			cb(1);
		}
		cb(0);
	}

	decrypt(payload, cb) {
		this.cb = cb;
		this.write(this.key_dir + '/client.oob.enc', payload, function() {
			if (shell.exec('bash ./src/decrypt.sh ' + this.key_dir + ' client.oob.enc client.oob', {silent: true}).code !== 0) {
				shell.echo('Decrypting OOB keys failed');
				shell.exit(1);
				cb(1);
			}
			fs.readFile(this.key_dir + '/client.oob', function read(err, data) {
				if (err) throw new Error(err);
				this(data);
			}.bind(cb));
		}.bind(this));
	}

	init() {
		this.genNonce(function(err) {
			if (err) return;
			this.rootCA(function(err) {
				if (err) return;
				this.deviceKeys(function(err) {
					if (err) return;
					this.genOOB(function(err) {
						if (err) return;
					})
				}.bind(this));
			}.bind(this));
		}.bind(this));
	}

	setClientEndpoint(endpoint) {
		this.client_endpoint = endpoint;
	}

	getClientEndpoint() {
		return this.client_endpoint;
	}

	write(fileName, contents, cb) {
		this.cb = cb;
		fs.writeFile(fileName, contents, function(err) {
			if (err) throw new Error(err);
			else this.cb();
		}.bind(this));
	}

};
