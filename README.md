# dns-proxy
DNS switch between multiple providers

## 🚀 Get Started

1.  **Install Node + Npm**

    Node: [installation guide](https://nodejs.org/en/)

2.  **Clone git project**

    ```sh
    # run command in your working directory
    git clone https://github.com/PotRemus/dns-proxy.git
    cd dns-proxy
    ```

3.  **Install dependencies**

    ```sh
    # install the dependencies
    npm install
    ```

4.  **Set DNS configuration**

    Open json file `./src/settings.json` and set your DNS configuration.
    
    Example:
    ```jsonc
    {
        "servers": [
            {
                "address": "8.8.8.8", // Google DNS
                "port": 53,
                "type": "udp"
            },
            {
                "address": "x.x.x.x", // Alternate DNS
                "port": 53,
                "type": "udp"
            }
        ]
    }
    ```

5.  **Start developing**

    ```sh
    # "start": "node src/dns-server.js"
    npm start
    ```

6.  **Configure your DNS network adapter**

    Set the DNS server for your network adapter with a local IP address (127.0.0.1)

## Install service
    It's only tested with windows service system, if you need more information for the other system you could find documentation in node-windows guide (https://github.com/coreybutler/node-windows)

1.  **Link node-windows**
    ```sh
    npm link node-windows
    ```

2.  **Install Service**
    ```sh
    # "install-service": "node install-service.js"
    npm run install-service
    ```

## Uninstall service
    ```sh
    # "uninstall-service": "node uninstall-service.js"
    npm run uninstall-service
    ```

## Links
Proxy Dns: https://peteris.rocks/blog/dns-proxy-server-in-node-js-with-ui/

node-windows: https://github.com/coreybutler/node-windows