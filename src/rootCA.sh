#!/bin/sh

set -e
dir=$1

if [ ! -f "${dir}/rootCA.key" ]; then
    echo "Root CA not found: Generating root CA"
    openssl ecparam -name prime256v1 -genkey -noout -out "${dir}/rootCA.key"
    openssl req -x509 -new -nodes -key "${dir}/rootCA.key" -sha256 -days 1024 -out "${dir}/rootCA.pem" -subj "//C=US\ST=TX\L=Austin\O=ARM\OU=REF\CN=ILS_ROOT"
    # openssl x509 -outform der -in "${dir}/rootCA.pem" -out "${dir}/rootCA.der"
fi
