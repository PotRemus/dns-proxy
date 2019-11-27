var Service = require('node-windows').Service;
var path = require('path');

// Create a new service object
var svc = new Service({
    name: 'Dns Proxy',
    script: path.resolve(__dirname, 'src', 'dns-server.js')
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', function () {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);
});

svc.on('alreadyuninstalled', function () {
    console.warn('Already uninstalled.');
});

// Uninstall the service.
svc.uninstall();