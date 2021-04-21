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

if [ ! -f "${dir}/rootCA.key" ]; then
    echo "Root CA not found: Generating root CA"
    openssl ecparam -name prime256v1 -genkey -noout -out "${dir}/rootCA.key"
    openssl req -x509 -new -nodes -key "${dir}/rootCA.key" -sha256 -days 1024 -out "${dir}/rootCA.pem" -subj "//C=US\ST=TX\L=Austin\O=ARM\OU=REF\CN=ILS_ROOT"
    # openssl x509 -outform der -in "${dir}/rootCA.pem" -out "${dir}/rootCA.der"
fi
