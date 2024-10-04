"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var stratos_config_1 = require("./lib/stratos.config");
// Generate the go file to include the required backend plugins
var sConfig = new stratos_config_1.StratosConfig(__dirname, {}, false);
console.log('Checking frontend packages for required backend plugins');
// Generate the go file to import the required backend plugins
var backendFolder = path.join(sConfig.rootDir, 'src', 'jetstream');
var backendPluginsFile = path.join(backendFolder, 'extra_plugins.go');
fs.writeFileSync(backendPluginsFile, 'package main\n\n');
fs.appendFileSync(backendPluginsFile, '// This file is auto-generated - DO NOT EDIT\n\n');
var backendPlugins = sConfig.getBackendPlugins();
if (backendPlugins.length === 0) {
    console.log('No backend plugins');
}
else {
    console.log('Backend plugins:');
    sConfig.getBackendPlugins().forEach(function (pkg) {
        // Check that the plugin exists
        if (fs.existsSync(path.join(backendFolder, 'plugins', pkg))) {
            fs.appendFileSync(backendPluginsFile, "import _ \"github.com/cloudfoundry-incubator/stratos/src/jetstream/plugins/" + pkg + "\"\n");
            console.log(" + " + pkg);
        }
        else {
            console.log(" + " + pkg + " : WARNING: Backend plugin does not exist");
        }
    });
}
console.log("Generated: " + backendPluginsFile);
