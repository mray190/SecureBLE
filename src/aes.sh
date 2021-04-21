#!/bin/sh

set -e
dir=$1

openssl pkeyutl -derive -out "${dir}/aes.key" -inkey "${dir}/device.key" -peerkey "${dir}/client.ecdh.pub"
