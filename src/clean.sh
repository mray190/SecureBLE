#!/bin/bash
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

rm -rf server_keys/device.*
rm -rf server_keys/client.*
rm -rf server_keys/plain.*
rm -rf server_keys/cipher.*
rm -rf server_keys/aes.*

rm -rf client_keys/device.*
rm -rf client_keys/client.*
rm -rf client_keys/plain.*
rm -rf client_keys/cipher.*
rm -rf client_keys/aes.*
