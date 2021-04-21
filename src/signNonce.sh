#!/bin/sh

set -e
dir=$1
openssl dgst -sha256 -sign "${dir}/device.key" -out "${dir}/client.nonce.signed.tmp" "${dir}/client.nonce"
openssl base64 -in "${dir}/client.nonce.signed.tmp" -out "${dir}/client.nonce.signed"
rm "${dir}/client.nonce.signed.tmp"
