"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitMetadata = void 0;
var fs = require("fs");
var path = require("path");
var GIT_METADATA_FILE = '.stratos-git-metadata.json';
/**
 * Represents the Git Metadata read from the metadata file or the
 * environment variables.
 *
 * This is embedded in the index.html file for diagnostic purposes
 */
var GitMetadata = /** @class */ (function () {
    function GitMetadata(dir) {
        this.exists = false;
        this.project = process.env.project || process.env.STRATOS_PROJECT || '';
        this.branch = process.env.branch || process.env.STRATOS_BRANCH || '';
        this.commit = process.env.commit || process.env.STRATOS_COMMIT || '';
        // Try and read the git metadata file
        var gitMetadataFile = path.join(dir, GIT_METADATA_FILE);
        if (fs.existsSync(gitMetadataFile)) {
            var gitMetadata = JSON.parse(fs.readFileSync(gitMetadataFile).toString());
            this.project = gitMetadata.project;
            this.branch = gitMetadata.branch;
            this.commit = gitMetadata.commit;
            this.exists = true;
        }
    }
    return GitMetadata;
}());
exports.GitMetadata = GitMetadata;
