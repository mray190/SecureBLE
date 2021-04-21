# Secure BLE

## Pre-requisites

* nodejs version 8 or higher
* npm (version corresponding to your nodejs version)
* openssl

## Setup

Clone the github repository, then from within the cloned repo run:
```
npm install
```

## Running

### Running the server

From within a terminal, run:
```
node index.js 9090 server_keys
```

This starts up the server device. Save the files `server_keys/rootCA.*`

### Running the client

Copy over the `server_keys/rootCA.*` files into the `client_keys` directory.

From within a different terminal, run:
```
node index.js 9091 client_keys http://localhost:9090
```

This starts up the client device and connects to the server. If you are running the client on a different device than the server, replace `http://localhost` with the IP address of the server.