"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const readerBase_1 = require("./readerBase");
var zip = require('zip');
class NuGetPackageReader extends readerBase_1.ReaderBase {
    async read(packagesFolder, nuGetPackage) {
        if (!packagesFolder)
            throw new Error("no packagesFolder");
        var packageFilePath = path.join(packagesFolder, nuGetPackage.id + "." + nuGetPackage.version, nuGetPackage.id + "." + nuGetPackage.version + ".nupkg");
        if (!fs.existsSync(packageFilePath)) {
            console.log("WARN: Cannot find nupkg file for " + nuGetPackage.id);
            console.log("Attempted to open this file: " + packageFilePath);
            return [];
        }
        var nuspecXml = this.openNuspecFile(packageFilePath);
        if (!nuspecXml) {
            console.log("WARN: Cannot find nuspec file for " + nuGetPackage.id);
            console.log("Attempted to open this file: " + packageFilePath);
            return [];
        }
        return await this.readAllDeps(nuspecXml);
    }
    async readAllDeps(nuspecXml) {
        var dependencies = [];
        const data = await this.parseXml(nuspecXml);
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