"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexHtmlHandler = void 0;
var fs = require("fs");
var path = require("path");
var stratos_config_1 = require("../lib/stratos.config");
/**
 * Transforms the index.html file
 *
 * Adds in the Git metadata
 * Adds in the custom loader from the theme, if there is one
 */
var IndexHtmlHandler = /** @class */ (function () {
    function IndexHtmlHandler(config) {
        this.config = config;
    }
    IndexHtmlHandler.prototype.apply = function (src) {
        // Patch different page title if there is one
        var title = this.config.stratosConfig.title || 'Stratos';
        src = src.replace(/@@TITLE@@/g, title);
        // // Git Information
        var gitMetadata = this.config.gitMetadata;
        src = src.replace(/@@stratos_git_project@@/g, gitMetadata.project);
        src = src.replace(/@@stratos_git_branch@@/g, gitMetadata.branch);
        src = src.replace(/@@stratos_git_commit@@/g, gitMetadata.commit);
        // // Date and Time that the build was made (approximately => it is when this script is run)
        src = src.replace(/@@stratos_build_date@@/g, new Date().toString());
        // Loading view (provided by theme)
        var loadingTheme = this.config.getTheme();
        var hasTheme = loadingTheme.stratos && loadingTheme.theme;
        // Custom loading indicator should default to the loading screen in the default theme, if custom theme does not have one
        if (!hasTheme || hasTheme && !loadingTheme.json.stratos.theme.loadingCss) {
            loadingTheme = this.config.getDefaultTheme();
        }
        var themePackageJson = loadingTheme.json;
        var themePackageFolder = loadingTheme.dir;
        var css = themePackageJson.stratos.theme.loadingCss;
        var html = themePackageJson.stratos.theme.loadingHtml;
        if (css) {
            var cssFile = path.resolve(themePackageFolder, css);
            if (fs.existsSync(cssFile)) {
                var loadingCss = fs.readFileSync(cssFile, 'utf8');
                src = src.replace(/\/\*\* @@LOADING_CSS@@ \*\*\//g, loadingCss);
            }
        }
        if (html) {
            var htmlFile = path.resolve(themePackageFolder, html);
            if (fs.existsSync(htmlFile)) {
                var loadingHtml = fs.readFileSync(htmlFile, 'utf8');
                src = src.replace(/<!-- @@LOADING_HTML@@ -->/g, loadingHtml);
            }
        }
        return src;
    };
    return IndexHtmlHandler;
}());
exports.IndexHtmlHandler = IndexHtmlHandler;
// Transform the index.html
var indexTransform = function (options, content) {
    // Get the Stratos config - don't log a second time
    var sConfig = new stratos_config_1.StratosConfig(__dirname, null, false);
    var handler = new IndexHtmlHandler(sConfig);
    var modified = handler.apply(content);
    return Promise.resolve(modified);
};
module.exports = indexTransform;
