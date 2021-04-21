#!/bin/sh

set -e
dir=$1

openssl x509 -pubkey -in "${dir}/client.pem" -noout > "${dir}/client.pub"
openssl base64 -d -in "${dir}/device.nonce.signed.tmp" -out "${dir}/device.nonce.signed"
rm "${dir}/device.nonce.signed.tmp"
openssl dgst -sha256 -verify "${dir}/client.pub" -signature "${dir}/device.nonce.signed" "${dir}/device.nonce"
