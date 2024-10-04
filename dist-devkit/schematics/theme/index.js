"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular-devkit/core");
var schematics_1 = require("@angular-devkit/schematics");
var schematics_2 = require("../../lib/schematics");
var schematics_3 = require("./../../lib/schematics");
// Reference: https://github.com/angular/angular-cli/tree/master/packages/schematics/angular
function addThemeToWorkspaceFile(options, projectRoot, projectName, distRoot) {
    return schematics_2.updateWorkspace(function (workspace) {
        if (workspace.projects.size === 0) {
            workspace.extensions.defaultProject = projectName;
        }
        workspace.projects.add({
            name: projectName,
            root: projectRoot,
            sourceRoot: projectRoot + "/src",
            projectType: schematics_2.ProjectType.Theme,
            targets: {
                build: {
                    builder: schematics_2.Builders.Theme,
                    options: {
                        outputPath: "" + distRoot,
                    },
                },
            }
        });
    });
}
function default_1(options) {
    var _this = this;
    return function (host, context) { return __awaiter(_this, void 0, void 0, function () {
        var projectName, packageName, scopeName, _a, scope, name_1, workspace, newProjectRoot, scopeFolder, folderName, projectRoot, distRoot, templateSource, optional;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!options.name) {
                        throw new schematics_1.SchematicsException("Invalid options, \"name\" is required.");
                    }
                    schematics_2.validateProjectName(options.name);
                    projectName = options.name;
                    packageName = core_1.strings.dasherize(projectName);
                    scopeName = null;
                    if (/^@.*\/.*/.test(options.name)) {
                        _a = options.name.split('/'), scope = _a[0], name_1 = _a[1];
                        scopeName = scope.replace(/^@/, '');
                        options.name = name_1;
                    }
                    return [4 /*yield*/, schematics_2.getWorkspace(host)];
                case 1:
                    workspace = _b.sent();
                    newProjectRoot = workspace.extensions.newProjectRoot || '';
                    scopeFolder = scopeName ? core_1.strings.dasherize(scopeName) + '/' : '';
                    folderName = "" + scopeFolder + core_1.strings.dasherize(options.name);
                    projectRoot = core_1.join(core_1.normalize(newProjectRoot), folderName);
                    distRoot = "dist/" + folderName;
                    templateSource = schematics_1.apply(schematics_1.url('./files'), [
                        schematics_1.applyTemplates(__assign(__assign(__assign({}, core_1.strings), options), { packageName: packageName,
                            projectRoot: projectRoot,
                            distRoot: distRoot, relativePathToWorkspaceRoot: schematics_2.relativePathToWorkspaceRoot(projectRoot), folderName: folderName, startosLatestVersion: schematics_3.Versions.Stratos })),
                        schematics_1.move(projectRoot),
                    ]);
                    optional = [];
                    if (options.includeLoader) {
                        optional.push(schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./loader-files'), [schematics_1.applyTemplates({}), schematics_1.move(projectRoot + "/loader")])));
                    }
                    if (options.includeAssets) {
                        optional.push(schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./asset-files'), [schematics_1.applyTemplates({}), schematics_1.move(projectRoot + "/assets")])));
                    }
                    return [2 /*return*/, schematics_1.chain(__spreadArrays([
                            schematics_1.mergeWith(templateSource)
                        ], optional, [
                            addThemeToWorkspaceFile(options, projectRoot, projectName, distRoot),
                        ]))];
            }
        });
    }); };
}
exports.default = default_1;
