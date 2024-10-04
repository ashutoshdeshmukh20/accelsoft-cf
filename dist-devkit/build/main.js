"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stratos_config_1 = require("../lib/stratos.config");
var assets_1 = require("./assets");
var extensions_1 = require("./extensions");
var sass_1 = require("./sass");
/**
 * Webpack customizations for Stratos
 *
 * The runBuilder function is exported and used as the function to apply
 * customizations to the Webpack configuration
 */
var StratosBuilder = /** @class */ (function () {
    function StratosBuilder(webpackConfig, options) {
        this.webpackConfig = webpackConfig;
        this.options = options;
    }
    StratosBuilder.prototype.run = function () {
        // Read in the Stratos config file if present (and do so config initialization)
        var sConfig = new stratos_config_1.StratosConfig(__dirname, this.options);
        // Sass handler for themes and themable packages
        var sass = new sass_1.SassHandler();
        sass.apply(this.webpackConfig, sConfig);
        // Assets from extensions or theme
        var assets = new assets_1.AssetsHandler();
        assets.apply(this.webpackConfig, sConfig);
        // Extensions (code)
        var ext = new extensions_1.ExtensionsHandler();
        ext.apply(this.webpackConfig, sConfig, this.options);
    };
    return StratosBuilder;
}());
// Apply the Stratos customizations to the webpack configuration
var runBuilder = function (config, options) {
    var builder = new StratosBuilder(config, options);
    builder.run();
    return config;
};
module.exports = runBuilder;
