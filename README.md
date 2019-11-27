# dns-proxy
DNS switch between multiple providers

## 🚀 Get Started

1.  **Install Node + Npm**

    Node: [installation guide](https://nodejs.org/en/)

2.  **Install dependencies**

    ```sh
    # install the dependencies
    npm install
    ```

3.  **Set DNS configuration**

    Open json file `./src/settings.json` and set your DNS configuration.
    
    Example:
    ```json
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

4.  **Start developing**

    ```sh
    # "start": "node src/dns-server.js"
    npm start
    ```

5.  **Configure your DNS network adapter**

    Set the DNS server for your network adapter with a local IP address (127.0.0.1)

## Install service

    It's only tested with windows service system, if you need more information for the other system you could find documentation in [node-windows Github](https://github.com/coreybutler/node-windows)
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