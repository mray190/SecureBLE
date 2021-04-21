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
openssl dgst -sha256 -sign "${dir}/device.key" -out "${dir}/client.nonce.signed.tmp" "${dir}/client.nonce"
openssl base64 -in "${dir}/client.nonce.signed.tmp" -out "${dir}/client.nonce.signed"
rm "${dir}/client.nonce.signed.tmp"
