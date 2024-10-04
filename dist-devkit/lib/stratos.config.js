"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StratosConfig = void 0;
var fs = require("fs");
var yaml = require("js-yaml");
var path = require("path");
var git_metadata_1 = require("./git.metadata");
var packages_1 = require("./packages");
/**
 * Represents the stratos.yaml file or the defaults if not found
 *
 * Also includes related config such as node_modules dirpath and angular.json file path
 */
var StratosConfig = /** @class */ (function () {
    function StratosConfig(dir, options, loggingEnabled) {
        var _this = this;
        if (loggingEnabled === void 0) { loggingEnabled = true; }
        this.loggingEnabled = true;
        this.angularJsonFile = this.findFileOrFolderInChain(dir, 'angular.json');
        this.angularJson = JSON.parse(fs.readFileSync(this.angularJsonFile, 'utf8').toString());
        this.loggingEnabled = loggingEnabled;
        // Top-level folder
        this.rootDir = path.dirname(this.angularJsonFile);
        // The Stratos config file is optional - allows overriding default behaviour
        this.stratosConfig = {};
        if (this.angularJsonFile) {
            // Read stratos.yaml if we can
            var stratosYamlFile = this.getStratosYamlPath();
            if (fs.existsSync(stratosYamlFile)) {
                try {
                    this.stratosConfig = yaml.safeLoad(fs.readFileSync(stratosYamlFile, 'utf8'));
                    // this.log(this.stratosConfig);
                    this.log('Read stratos.yaml okay from: ' + stratosYamlFile);
                }
                catch (e) {
                    this.log(e);
                }
            }
            else {
                this.log('Using default configuration');
            }
        }
        // Exclude the default packages... unless explicity `include`d
        this.applyDefaultExcludes();
        // Exclude packages from the STRATOS_BUILD_REMOVE environment variable
        this.excludeFromEnvVar();
        this.packageJsonFile = this.findFileOrFolderInChain(this.rootDir, 'package.json');
        if (this.packageJsonFile !== null) {
            this.packageJson = JSON.parse(fs.readFileSync(this.packageJsonFile, 'utf8').toString());
        }
        this.nodeModulesFile = this.findFileOrFolderInChain(this.rootDir, 'node_modules');
        this.gitMetadata = new git_metadata_1.GitMetadata(this.rootDir);
        // this.log(this.gitMetadata);
        if (this.gitMetadata.exists) {
            this.log('Read git metadata file');
        }
        this.newProjectRoot = path.join(this.rootDir, this.angularJson.newProjectRoot);
        // Discover all packages
        // Helper to discover and interpret packages
        this.packages = new packages_1.Packages(this, this.nodeModulesFile, this.newProjectRoot);
        this.packages.setLogger(this);
        this.packages.scan(this.packageJson);
        this.log('Using theme ' + this.packages.theme.name);
        var extensions = this.getExtensions();
        if (extensions.length === 0) {
            this.log('Building without any extensions');
        }
        else {
            this.log('Building with these extensions:');
            extensions.forEach(function (ext) { return _this.log(" + " + ext.package); });
        }
    }
    StratosConfig.prototype.getStratosYamlPath = function () {
        if (process.env.STRATOS_YAML) {
            return process.env.STRATOS_YAML;
        }
        return path.join(path.dirname(this.angularJsonFile), 'stratos.yaml');
    };
    StratosConfig.prototype.applyDefaultExcludes = function () {
        var _this = this;
        var defaultExcludedPackages = ['@example/theme', '@example/extensions', '@stratosui/desktop-extensions'];
        if (this.stratosConfig && this.stratosConfig.packages && this.stratosConfig.packages.desktop) {
            defaultExcludedPackages.pop();
            this.log('Building with desktop package');
        }
        var exclude = [];
        // Are the default excluded packages explicitly in the include section?
        if (this.stratosConfig &&
            this.stratosConfig.packages &&
            this.stratosConfig.packages.include &&
            this.stratosConfig.packages.include.length > 0 // Will check if this is an array
        ) {
            defaultExcludedPackages.forEach(function (ep) { return _this.addIfMissing(_this.stratosConfig.packages.include, ep, exclude); });
        }
        else {
            exclude.push.apply(exclude, defaultExcludedPackages);
        }
        // No op
        if (exclude.length < 1) {
            return;
        }
        // If default excluded packages are not in include section, add them to the exclude
        if (!this.stratosConfig) {
            this.stratosConfig = {};
        }
        if (!this.stratosConfig.packages) {
            this.stratosConfig.packages = {};
        }
        if (!this.stratosConfig.packages.exclude) {
            this.stratosConfig.packages.exclude = [];
        }
        exclude.forEach(function (e) { return _this.addIfMissing(_this.stratosConfig.packages.exclude, e); });
    };
    StratosConfig.prototype.addIfMissing = function (array, entry, dest) {
        if (dest === void 0) { dest = array; }
        if (array.indexOf(entry) < 0) {
            dest.push(entry);
        }
    };
    // Exclude any packages specified in the STRATOS_BUILD_REMOVE environment variable
    StratosConfig.prototype.excludeFromEnvVar = function () {
        var _this = this;
        var buildRemove = process.env.STRATOS_BUILD_REMOVE || '';
        if (buildRemove.length === 0) {
            return;
        }
        var exclude = buildRemove.split(',');
        console.log("Detected STRATOS_BUILD_REMOVE: " + buildRemove);
        // Add the package to the list of excludes
        exclude.forEach(function (e) { return _this.addIfMissing(_this.stratosConfig.packages.exclude, e.trim()); });
    };
    StratosConfig.prototype.log = function (msg) {
        if (this.loggingEnabled) {
            console.log(msg);
        }
    };
    StratosConfig.prototype.getTheme = function () {
        return this.packages.theme;
    };
    StratosConfig.prototype.getDefaultTheme = function () {
        return this.packages.packageMap[packages_1.DEFAULT_THEME];
    };
    StratosConfig.prototype.getExtensions = function () {
        return this.packages.packages.filter(function (p) { return !!p.extension; }).map(function (pkg) { return pkg.extension; });
    };
    StratosConfig.prototype.getAssets = function () {
        var assets = [];
        this.packages.packages.forEach(function (pkg) {
            if (pkg.assets) {
                assets.push.apply(assets, pkg.assets);
            }
        });
        return assets;
    };
    StratosConfig.prototype.getBackendPlugins = function () {
        var plugins = {};
        this.packages.packages.forEach(function (pkg) {
            pkg.backendPlugins.forEach(function (name) {
                plugins[name] = true;
            });
        });
        if (this.stratosConfig.backend) {
            this.stratosConfig.backend.forEach(function (name) {
                plugins[name] = true;
            });
        }
        return Object.keys(plugins);
    };
    StratosConfig.prototype.getThemedPackages = function () {
        return this.packages.packages.filter(function (p) { return !!p.theming; }).map(function (pkg) { return pkg.theming; });
    };
    StratosConfig.prototype.getPackageJsonFolder = function () {
        return path.dirname(this.packageJsonFile);
    };
    StratosConfig.prototype.getNodeModulesFolder = function () {
        return path.dirname(this.nodeModulesFile);
    };
    // Go up the directory hierarchy and look for the named file or folder
    StratosConfig.prototype.findFileOrFolderInChain = function (dir, name) {
        var parent = path.dirname(dir);
        var itemPath = path.join(dir, name);
        if (fs.existsSync(itemPath)) {
            return itemPath;
        }
        if (parent === dir) {
            return null;
        }
        return this.findFileOrFolderInChain(parent, name);
    };
    // Resolve a known package or return null if not a known package
    StratosConfig.prototype.resolveKnownPackage = function (pkg) {
        var p = this.packages.packageMap[pkg];
        if (p) {
            var packagePath = p.dir;
            if (!path.isAbsolute(packagePath)) {
                packagePath = path.resolve(packagePath);
            }
            return packagePath;
        }
        return null;
    };
    // Resolve a package to a directory to a file path, if name is given
    StratosConfig.prototype.resolvePackage = function (pkg, name) {
        var packagePath;
        var pkgInfo = this.packages.packageMap[pkg];
        if (pkgInfo) {
            packagePath = pkgInfo.dir;
        }
        else {
            // Default to getting the package from the node_modules folder
            packagePath = path.join(this.getNodeModulesFolder(), pkg);
        }
        if (!path.isAbsolute(packagePath)) {
            packagePath = path.resolve(packagePath);
        }
        if (name) {
            packagePath = path.join(packagePath, name);
        }
        return packagePath;
    };
    return StratosConfig;
}());
exports.StratosConfig = StratosConfig;
