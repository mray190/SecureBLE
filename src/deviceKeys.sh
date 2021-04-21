#!/bin/sh

set -e
dir=$1

openssl ecparam -name prime256v1 -genkey -noout -out "${dir}/device.key"
openssl req -new -key "${dir}/device.key" -out "${dir}/device.csr" -subj "//C=US\ST=TX\L=Austin\O=ARM\OU=REF\CN=ILS"
openssl x509 -req -in "${dir}/device.csr" -CA "${dir}/rootCA.pem" -CAkey "${dir}/rootCA.key" -CAcreateserial -days 500 -out "${dir}/device.pem"
openssl ec -in "${dir}/device.key" -pubout -out "${dir}/device.ecdh.pub"
# openssl x509 -outform der -in "${dir}/device.pem" -out "${dir}/device.der"
