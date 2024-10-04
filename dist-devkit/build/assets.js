"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsHandler = void 0;
var CopyPlugin = require("copy-webpack-plugin");
// Handler ensures all assets from packages are copied as part of the build
var AssetsHandler = /** @class */ (function () {
    function AssetsHandler() {
    }
    AssetsHandler.prototype.apply = function (webpackConfig, config) {
        var assetsCopyConfig = config.getAssets();
        if (assetsCopyConfig.length > 0) {
            // Add a plugin to copy assets - this will ensure we copy the assets from each extension and the theme
            var plugins = [
                new CopyPlugin({
                    patterns: assetsCopyConfig
                })
            ];
            webpackConfig.plugins = webpackConfig.plugins.concat(plugins);
        }
    };
    return AssetsHandler;
}());
exports.AssetsHandler = AssetsHandler;
