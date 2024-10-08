"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspace = exports.updateWorkspace = exports.relativePathToWorkspaceRoot = exports.validateProjectName = exports.ProjectType = exports.Versions = exports.Builders = void 0;
var core_1 = require("@angular-devkit/core");
var schematics_1 = require("@angular-devkit/schematics");
exports.Builders = {
    Theme: '@stratosui/devkit:stratos-theme'
};
exports.Versions = {
    Stratos: '0.1.0',
};
exports.ProjectType = {
    Theme: 'library',
};
// =========================================================================================================
// Utilities from the Angular Schema repository
// =========================================================================================================
// See: https://github.com/angular/angular-cli/blob/master/packages/schematics/angular/utility/validation.ts
function validateProjectName(projectName) {
    var errorIndex = getRegExpFailPosition(projectName);
    var unsupportedProjectNames = [];
    var packageNameRegex = /^(?:@[a-zA-Z0-9_-]+\/)?[a-zA-Z0-9_-]+$/;
    if (errorIndex !== null) {
        var firstMessage = core_1.tags.oneLine(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    Project name \"", "\" is not valid. New project names must\n    start with a letter, and must contain only alphanumeric characters or dashes.\n    When adding a dash the segment after the dash must also start with a letter.\n    "], ["\n    Project name \"", "\" is not valid. New project names must\n    start with a letter, and must contain only alphanumeric characters or dashes.\n    When adding a dash the segment after the dash must also start with a letter.\n    "])), projectName);
        var msg = core_1.tags.stripIndent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    ", "\n    ", "\n    ", "\n    "], ["\n    ", "\n    ", "\n    ", "\n    "])), firstMessage, projectName, Array(errorIndex + 1).join(' ') + '^');
        throw new schematics_1.SchematicsException(msg);
    }
    else if (unsupportedProjectNames.indexOf(projectName) !== -1) {
        throw new schematics_1.SchematicsException("Project name " + JSON.stringify(projectName) + " is not a supported name.");
    }
    else if (!packageNameRegex.test(projectName)) {
        throw new schematics_1.SchematicsException("Project name " + JSON.stringify(projectName) + " is invalid.");
    }
}
exports.validateProjectName = validateProjectName;
function getRegExpFailPosition(str) {
    var isScope = /^@.*\/.*/.test(str);
    if (isScope) {
        // Remove starting @
        str = str.replace(/^@/, '');
        // Change / to - for validation
        str = str.replace(/\//g, '-');
    }
    var parts = str.indexOf('-') >= 0 ? str.split('-') : [str];
    var matched = [];
    var projectNameRegexp = /^[a-zA-Z][.0-9a-zA-Z]*(-[.0-9a-zA-Z]*)*$/;
    parts.forEach(function (part) {
        if (part.match(projectNameRegexp)) {
            matched.push(part);
        }
    });
    var compare = matched.join('-');
    return (str !== compare) ? compare.length : null;
}
// See: https://github.com/angular/angular-cli/blob/master/packages/schematics/angular/utility/paths.ts
function relativePathToWorkspaceRoot(projectRoot) {
    var normalizedPath = core_1.split(core_1.normalize(projectRoot || ''));
    if (normalizedPath.length === 0 || !normalizedPath[0]) {
        return '.';
    }
    else {
        return normalizedPath.map(function () { return '..'; }).join('/');
    }
}
exports.relativePathToWorkspaceRoot = relativePathToWorkspaceRoot;
function updateWorkspace(updaterOrWorkspace) {
    var _this = this;
    return function (tree) { return __awaiter(_this, void 0, void 0, function () {
        var host, workspace, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    host = createHost(tree);
                    if (!(typeof updaterOrWorkspace === 'function')) return [3 /*break*/, 5];
                    return [4 /*yield*/, core_1.workspaces.readWorkspace('/', host)];
                case 1:
                    workspace = (_a.sent()).workspace;
                    result = updaterOrWorkspace(workspace);
                    if (!(result !== undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, result];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, core_1.workspaces.writeWorkspace(workspace, host)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, core_1.workspaces.writeWorkspace(updaterOrWorkspace, host)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); };
}
exports.updateWorkspace = updateWorkspace;
function getWorkspace(tree, path) {
    if (path === void 0) { path = '/'; }
    return __awaiter(this, void 0, void 0, function () {
        var host, workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    host = createHost(tree);
                    return [4 /*yield*/, core_1.workspaces.readWorkspace(path, host)];
                case 1:
                    workspace = (_a.sent()).workspace;
                    return [2 /*return*/, workspace];
            }
        });
    });
}
exports.getWorkspace = getWorkspace;
function createHost(tree) {
    return {
        readFile: function (path) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    data = tree.read(path);
                    if (!data) {
                        throw new Error('File not found.');
                    }
                    return [2 /*return*/, core_1.virtualFs.fileBufferToString(data)];
                });
            });
        },
        writeFile: function (path, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, tree.overwrite(path, data)];
                });
            });
        },
        isDirectory: function (path) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // approximate a directory check
                    return [2 /*return*/, !tree.exists(path) && tree.getDir(path).subfiles.length > 0];
                });
            });
        },
        isFile: function (path) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, tree.exists(path)];
                });
            });
        },
    };
}
var templateObject_1, templateObject_2;
