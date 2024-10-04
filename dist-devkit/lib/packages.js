"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packages = exports.DEFAULT_THEME = void 0;
var fs = require("fs");
var path = require("path");
// Helpers for getting list of dirs in a dir
var isDirectory = function (source) {
    var realPath = fs.realpathSync(source);
    var stats = fs.lstatSync(realPath);
    return stats.isDirectory();
};
var getDirectories = function (source) {
    return fs.readdirSync(source).map(function (name) { return path.join(source, name); }).filter(isDirectory);
};
// Default theme to use
exports.DEFAULT_THEME = '@stratosui/theme';
var Packages = /** @class */ (function () {
    function Packages(config, nodeModulesFolder, localPackagesFolder) {
        this.config = config;
        this.nodeModulesFolder = nodeModulesFolder;
        this.localPackagesFolder = localPackagesFolder;
        this.packages = [];
        this.packageMap = new Map();
        this.pkgReadMap = new Map();
    }
    // Try and find and load a package.json file in the specified folder
    Packages.loadPackageFile = function (dir) {
        var pkgFile = path.join(dir, 'package.json');
        var pkg = null;
        if (fs.existsSync(pkgFile)) {
            try {
                pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8').toString());
            }
            catch (e) { }
        }
        return pkg;
    };
    Packages.prototype.setLogger = function (logger) {
        this.logger = logger;
    };
    Packages.prototype.log = function (msg) {
        if (this.logger) {
            this.logger.log(msg);
        }
    };
    // Look for packages
    Packages.prototype.scan = function (packageJson) {
        var _this = this;
        this.pkgReadMap = new Map();
        if (packageJson.peerDependencies) {
            Object.keys(packageJson.peerDependencies).forEach(function (dep) {
                _this.addPackage(dep);
            });
        }
        // Read all dependencies
        if (packageJson.dependencies) {
            Object.keys(packageJson.dependencies).forEach(function (dep) {
                _this.addPackage(dep);
            });
        }
        // Local folders
        // Find all local packages in the folder
        getDirectories(this.localPackagesFolder).forEach(function (pkgDir) {
            var pkgFile = Packages.loadPackageFile(pkgDir);
            if (pkgFile !== null) {
                _this.addPackage(pkgDir, true);
            }
            else {
                getDirectories(pkgDir).forEach(function (pDir) { return _this.addPackage(pDir, true); });
            }
        });
        // Figure out the theme
        if (!this.config.stratosConfig.theme) {
            // Theme was not set, so find the first theme that is not the default theme
            var theme = this.packages.find(function (pkg) { return pkg.theme && pkg.name !== exports.DEFAULT_THEME; });
            if (!theme) {
                this.theme = this.packageMap[exports.DEFAULT_THEME];
            }
            else {
                this.theme = theme;
            }
        }
        else {
            this.theme = this.packageMap[this.config.stratosConfig.theme];
        }
        // Ensure that the theme is last in the list, so that its resources are copied last
        var index = this.packages.findIndex(function (pkg) { return pkg.name === _this.theme.name; });
        if (index > -1) {
            var items = this.packages.splice(index, 1);
            this.packages.push(items[0]);
        }
        var excludeMap = {};
        var excludes = this.config.stratosConfig.packages.exclude;
        excludes.forEach(function (e) {
            excludeMap[e] = true;
        });
        var remove = {};
        // We have the excludes and the set of packages - remove any that have the excludes as dependencies
        this.packages.forEach(function (pkg) {
            if (_this.hasExcludedDepenedncey(pkg, excludeMap)) {
                remove[pkg.name] = pkg;
            }
        });
        // Filter packages to remove as needed
        this.packages = this.packages.filter(function (p) { return !remove[p.name]; });
        this.log('Packages:');
        this.packages.forEach(function (pkg) { return _this.log(" + " + pkg.name); });
    };
    Packages.prototype.hasExcludedDepenedncey = function (pkg, exclude) {
        // Check peer dependencies
        if (pkg.json.peerDependencies) {
            for (var _i = 0, _a = Object.keys(pkg.json.peerDependencies); _i < _a.length; _i++) {
                var p = _a[_i];
                if (exclude[p]) {
                    console.log("Removing package " + pkg.name + " due to peer dependency " + p);
                    return true;
                }
            }
        }
        return false;
    };
    Packages.prototype.addPackage = function (pkgName, isLocal) {
        var _this = this;
        if (isLocal === void 0) { isLocal = false; }
        if (this.pkgReadMap[pkgName]) {
            return;
        }
        this.pkgReadMap[pkgName] = true;
        var pkgDir = pkgName;
        if (!isLocal) {
            pkgDir = path.join(this.nodeModulesFolder, pkgName);
        }
        // Read the package file
        var pkgFile = Packages.loadPackageFile(pkgDir);
        if (pkgFile !== null) {
            // Check to see if we should include this package
            if (this.includePackage(pkgFile)) {
                // Process all of the peer dependencies first
                if (pkgFile.peerDependencies) {
                    Object.keys(pkgFile.peerDependencies).forEach(function (dep) { return _this.addPackage(dep); });
                }
                var pkg = this.processPackage(pkgFile, pkgDir);
                this.add(pkg);
            }
        }
    };
    Packages.prototype.add = function (item) {
        if (!this.packageMap[item.name]) {
            // We don't already have this package
            this.packages.push(item);
            this.packageMap[item.name] = item;
        }
    };
    // Get all of the extensions
    Packages.prototype.getExtensions = function () {
        var extensions = [];
        this.packages.forEach(function (pkg) {
            if (pkg.extension) {
                extensions.push(pkg.extension);
            }
        });
        return extensions;
    };
    // Should we include the specified package?
    Packages.prototype.includePackage = function (pkg) {
        // Must be a stratos package
        if (!pkg.stratos) {
            return false;
        }
        // If we don't have any explicit includes, then include it
        if (!this.config.stratosConfig.packages) {
            return true;
        }
        // Use the include set if one is specified
        if (this.config.stratosConfig.packages.include) {
            return this.config.stratosConfig.packages.include.includes(pkg.name);
        }
        // Remove any excluded extensions
        if (this.config.stratosConfig.packages.exclude) {
            return !this.config.stratosConfig.packages.exclude.includes(pkg.name);
        }
        return true;
    };
    // Process the package file and look for Stratos metadata
    Packages.prototype.processPackage = function (pkg, folder) {
        var info = {
            name: pkg.name,
            dir: folder,
            stratos: !!pkg.stratos,
            json: pkg,
            ignore: pkg.stratos ? pkg.stratos.ignore || false : false,
            theme: pkg.stratos && pkg.stratos.theme,
            theming: this.getThemingConfig(pkg, folder),
            assets: this.getAssets(pkg, folder),
            backendPlugins: pkg.stratos ? pkg.stratos.backend || [] : [],
        };
        // If this is an extension, add extension metadata
        if (pkg.stratos && (pkg.stratos.module || pkg.stratos.routingModule)) {
            info.extension = {
                package: pkg.name,
                module: pkg.stratos.module,
                routingModule: pkg.stratos.routingModule
            };
        }
        return info;
    };
    // Get any theming metadata - this allows a package to theme its own components using the theme
    Packages.prototype.getThemingConfig = function (pkg, packagePath) {
        if (pkg.stratos && pkg.stratos.theming) {
            var refParts = pkg.stratos.theming.split('#');
            if (refParts.length === 2) {
                var themingConfig = {
                    ref: pkg.stratos.theming,
                    package: pkg.name,
                    scss: refParts[0],
                    mixin: refParts[1],
                    importPath: '~' + pkg.name + '/' + refParts[0]
                };
                this.log('Found themed package: ' + pkg.name + ' (' + pkg.stratos.theming + ')');
                return themingConfig;
            }
            else {
                this.log('Invalid theming reference: ' + pkg.stratos.theming);
            }
        }
        return null;
    };
    // Get any assets that the package has
    Packages.prototype.getAssets = function (pkg, packagePath) {
        var assets = [];
        // Check for assets
        if (pkg.stratos && pkg.stratos.assets) {
            Object.keys(pkg.stratos.assets).forEach(function (src) {
                var abs = path.join(packagePath, src);
                abs = path.resolve(abs);
                assets.push({
                    from: abs,
                    to: pkg.stratos.assets[src],
                    force: true
                });
            });
        }
        return assets.length ? assets : null;
    };
    return Packages;
}());
exports.Packages = Packages;
