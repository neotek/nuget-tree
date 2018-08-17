"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const readerBase_1 = require("./readerBase");
var zip = require('zip');
class NuGetPackageReader extends readerBase_1.ReaderBase {
    constructor() {
        super();
        this.nuGet3Dir = path.join(require('os').homedir(), ".nuget/packages");
    }
    async read(packagesFolder, nuGetPackage) {
        if (!packagesFolder)
            throw new Error("no packagesFolder");
        const packageFileName = nuGetPackage.id + "." + nuGetPackage.version + ".nupkg";
        let packageFilePath = path.join(packagesFolder, nuGetPackage.id + "." + nuGetPackage.version, packageFileName);
        if (!fs.existsSync(packageFilePath)) {
            // Get from NuGet V3 path
            packageFilePath = path.join(this.nuGet3Dir, nuGetPackage.id, nuGetPackage.version, packageFileName);
            if (!fs.existsSync(packageFilePath)) {
                console.log("WARN: Cannot find nupkg file for " + nuGetPackage.id);
                console.log("Attempted to open this file: " + packageFilePath);
                return [];
            }
        }
        var nuspecXml = this.openNuspecFile(packageFilePath);
        if (!nuspecXml) {
            console.log("WARN: Cannot find nuspec file for " + nuGetPackage.id);
            console.log("Attempted to open this file: " + packageFilePath);
            return [];
        }
        const nuspec = await this.parseXml(nuspecXml);
        if (nuspec.package.metadata && nuspec.package.metadata.length) {
            var metadata = nuspec.package.metadata[0];
            nuGetPackage.licenseUrl = metadata.licenseUrl && metadata.licenseUrl.length ? metadata.licenseUrl[0] : null;
            nuGetPackage.projectUrl = metadata.projectUrl && metadata.projectUrl.length ? metadata.projectUrl[0] : null;
        }
        return this.readAllDeps(nuspec);
    }
    readAllDeps(data) {
        var dependencies = [];
        (data.package.metadata || []).forEach((metadata) => {
            (metadata.dependencies || []).forEach((dep) => {
                // if the nuget package targets multiple version, there are groups
                (dep.group || []).forEach((dep) => {
                    (dep.dependency || []).forEach((dep) => {
                        dependencies.push(dep.$);
                    });
                });
                // otherwise there are no groups
                (dep.dependency || []).forEach((dep) => {
                    dependencies.push(dep.$);
                });
            });
        });
        return dependencies;
    }
    openNuspecFile(packageFilePath) {
        var pkgData = fs.readFileSync(packageFilePath);
        var reader = zip.Reader(pkgData);
        var nuspec;
        reader.forEach((entry, next) => {
            if (path.extname(entry._header.file_name) === ".nuspec") {
                nuspec = this.readSafe(entry.getData());
            }
        });
        return nuspec;
    }
}
exports.NuGetPackageReader = NuGetPackageReader;
//# sourceMappingURL=nuGetPackageReader.js.map