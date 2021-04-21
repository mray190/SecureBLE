#!/bin/sh

set -e
dir=$1

openssl verify -CAfile "${dir}/rootCA.pem" "${dir}/client.pem"
