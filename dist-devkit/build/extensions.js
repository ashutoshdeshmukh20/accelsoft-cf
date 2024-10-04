"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionsHandler = void 0;
var fs = require("fs");
var path = require("path");
var webpack_1 = require("webpack");
var importModuleRegex = /src\/frontend\/packages\/core\/src\/custom-import.module.ts/;
var isWindows = process.platform === 'win32';
/**
 * Generates the file _custom-import.module.ts containing the code to import
 * the extensions modules discovered from the packages being included.
 *
 * This also adds a module replacement into the build process, so that this generated file
 * is used instead of the default one in the repository, which does not import
 * any extensions.
 */
var ExtensionsHandler = /** @class */ (function () {
    function ExtensionsHandler() {
    }
    // Write out the _custom-import.module.ts file importing all of the required extensions
    ExtensionsHandler.prototype.apply = function (webpackConfig, config, options) {
        // Generate the module file to import the appropriate extensions
        var dir = path.join(config.rootDir, path.dirname(options.main));
        var overrideFile = path.resolve(path.join(dir, './_custom-import.module.ts'));
        fs.writeFileSync(overrideFile, '// This file is auto-generated - DO NOT EDIT\n\n');
        fs.appendFileSync(overrideFile, 'import { NgModule } from \'@angular/core\';\n');
        var moduleImports = {
            imports: []
        };
        var routingModuleImports = {
            imports: []
        };
        config.getExtensions().forEach(function (e) {
            var modules = [];
            if (e.module) {
                moduleImports.imports.push(e.module);
                modules.push(e.module);
            }
            if (e.routingModule) {
                routingModuleImports.imports.push(e.routingModule);
                modules.push(e.routingModule);
            }
            fs.appendFileSync(overrideFile, 'import { ' + modules.join(', ') + ' } from \'' + e.package + '\';\n');
        });
        this.writeModule(overrideFile, 'CustomImportModule', moduleImports);
        this.writeModule(overrideFile, 'CustomRoutingImportModule', routingModuleImports);
        var regex;
        // On windows, use an absolute path with backslashes escaped
        if (isWindows) {
            var p = path.resolve(path.join(dir, 'custom-import.module.ts'));
            p = p.replace(/\\/g, '\\\\');
            regex = new RegExp(p);
        }
        else {
            regex = importModuleRegex;
        }
        // Ignore changed in the overrides file - otherwise with ng serve we will build twice
        // The user needs to restart `ng serve` anyway if new extensions are added
        webpackConfig.plugins.push(new webpack_1.WatchIgnorePlugin([overrideFile]));
        webpackConfig.plugins.push(new webpack_1.NormalModuleReplacementPlugin(regex, overrideFile));
    };
    ExtensionsHandler.prototype.writeModule = function (file, name, imports) {
        fs.appendFileSync(file, '\n@NgModule(\n');
        var json = JSON.stringify(imports, null, 2);
        json = json.replace(/['"]+/g, '');
        fs.appendFileSync(file, json);
        fs.appendFileSync(file, ')\n');
        fs.appendFileSync(file, 'export class ' + name + ' {}\n\n');
    };
    return ExtensionsHandler;
}());
exports.ExtensionsHandler = ExtensionsHandler;
