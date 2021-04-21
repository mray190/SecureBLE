#!/bin/sh
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

set -e
dir=$1

openssl ecparam -name prime256v1 -genkey -noout -out "${dir}/device.key"
openssl req -new -key "${dir}/device.key" -out "${dir}/device.csr" -subj "//C=US\ST=TX\L=Austin\O=ARM\OU=REF\CN=ILS"
openssl x509 -req -in "${dir}/device.csr" -CA "${dir}/rootCA.pem" -CAkey "${dir}/rootCA.key" -CAcreateserial -days 500 -out "${dir}/device.pem"
openssl ec -in "${dir}/device.key" -pubout -out "${dir}/device.ecdh.pub"
# openssl x509 -outform der -in "${dir}/device.pem" -out "${dir}/device.der"
