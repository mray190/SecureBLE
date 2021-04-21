#!/bin/sh

set -e
dir=$1
input=$2
output=$3

openssl enc -aes256 -base64 -k $(base64 "${dir}/aes.key") -e -in "${dir}/${input}" -out "${dir}/${output}"
