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

openssl x509 -pubkey -in "${dir}/client.pem" -noout > "${dir}/client.pub"
openssl base64 -d -in "${dir}/device.nonce.signed.tmp" -out "${dir}/device.nonce.signed"
rm "${dir}/device.nonce.signed.tmp"
openssl dgst -sha256 -verify "${dir}/client.pub" -signature "${dir}/device.nonce.signed" "${dir}/device.nonce"
