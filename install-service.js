var Service = require('node-windows').Service;
var path = require('path');

// Create a new service object
var svc = new Service({
  name: 'Dns Proxy V1',
  description: 'Remus DNS optimization between multiple providers',
  script: path.join(__dirname, 'src', 'dns-server.js'),
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
  svc.start();
  console.log('Install complete.');
});

svc.on('alreadyinstalled', function () {
  console.warn('Already installed.');
});

svc.on('invalidinstallation', function () {
  console.error('Invalid installation.');
});

svc.install();