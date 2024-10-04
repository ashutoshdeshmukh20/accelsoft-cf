"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SassHandler = void 0;
var path = require("path");
/**
 * Sass Handler
 *
 * Provides some custom resolution of sass files so that the theming
 * is applied to components and that the chosen theme is used.
 *
 * Essentially intercepts package imports of the form ~@startosui/theme
 * and ensures the correct packaeg is used.
 */
var SassHandler = /** @class */ (function () {
    function SassHandler() {
    }
    //  Set options on the Webpack sass-loader plugin to use us as a custom importer
    SassHandler.prototype.apply = function (webpackConfig, config) {
        var _this = this;
        // Find the node-saas plugin and add a custom import resolver
        webpackConfig.module.rules.forEach(function (rule) {
            if (rule.include) {
                rule.use.forEach(function (p) {
                    if (p.loader && p.loader.indexOf('sass-loader') > 0) {
                        p.options.sassOptions = {
                            importer: _this.customSassImport(config)
                        };
                    }
                });
            }
        });
    };
    SassHandler.prototype.customSassImport = function (config) {
        var that = this;
        return function (url, resourcePath) {
            if (url === '~@stratosui/theme/extensions') {
                // Generate SCSS to appy theming to the packages that need to be themed
                return {
                    contents: that.getThemingForPackages(config)
                };
            }
            else if (url === '~@stratosui/theme') {
                return {
                    file: config.resolvePackage(config.getTheme().name, '_index.scss')
                };
            }
            else if (url.indexOf('~') === 0) {
                // See if we have an override
                var pkg = url.substr(1);
                var pkgParts = pkg.split('/');
                var pkgName = '';
                if (pkgParts[0].indexOf('@') === 0) {
                    // Package name has a scope
                    pkgName = pkgParts.shift() + '/' + pkgParts.shift();
                }
                else {
                    pkgName = pkgParts.shift();
                }
                var pkgPath = pkgParts.join(path.sep);
                // See if we can resolve the package name
                var knownPath = config.resolveKnownPackage(pkgName);
                if (knownPath) {
                    return {
                        file: path.join(knownPath, pkgPath + '.scss')
                    };
                }
            }
            // We could not resolve, so leave to the default resolver
            return null;
        };
    };
    // Generate an import and include for each themable package so that we theme
    // its components when the application is built.
    SassHandler.prototype.getThemingForPackages = function (c) {
        var contents = '';
        var themedPackages = c.getThemedPackages();
        themedPackages.forEach(function (themingConfig) {
            contents += "@import '" + themingConfig.importPath + "';\n";
        });
        contents += '\n@mixin apply-theme($stratos-theme) {\n';
        themedPackages.forEach(function (themingConfig) {
            contents += "  @include " + themingConfig.mixin + "($stratos-theme);\n";
        });
        contents += '}\n';
        return contents;
    };
    return SassHandler;
}());
exports.SassHandler = SassHandler;
