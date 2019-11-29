var Service = require('node-window').Service;
var path = require('path');

var appArgs = process.argv.slice(2);
if (appArgs.length != 1) {
    displayHelp();
    return;
}
appArg = appArgs[0];
if (appArg != "-i" || appArg != "-install" || appArg != "-u" || appArg != "-uninstall") {
    displayHelp();
    return;
}

if (appArgs.length == 1) {
    if (appArgs == "-i" || appArg != "-install") {
        installService();
        return;
    } else {
        uninstallService();
        return;
    }
}
console.log('__dirname', __dirname);
console.log('Usage: node ./src/service-install.js [option]\n');
console.log('Options:');
console.log('-i, -install\t\tinstall the dns proxy service');
console.log('-u, -uninstall\t\tuninstall the dns proxy service');
console.log('\nDocumentation can be found at https://github.com/PotRemus/dns-proxy');

function installService() {
    // Create a new service object
    var svc = new Service({
        name: 'Dns Proxy',
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
}

function uninstallService() {
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
}