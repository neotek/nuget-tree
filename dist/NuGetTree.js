"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packageReferenceReader_1 = require("./readers/packageReferenceReader");
const packagesConfigReader_1 = require("./readers/packagesConfigReader");
const nuGetPackageReader_1 = require("./readers/nuGetPackageReader");
const solutionReader_1 = require("./readers/solutionReader");
var colors = Promise.resolve().then(() => require('colors'));
const archy = require("archy");
const path = require("path");
class NuGetTree {
    constructor(settings) {
        this.settings = settings;
        this.packageReference = new packageReferenceReader_1.PackageReferenceReader();
        this.packageConfig = new packagesConfigReader_1.PackagesConfigReader();
        this.nuGetPackageReader = new nuGetPackageReader_1.NuGetPackageReader();
        this.solutionReader = new solutionReader_1.SolutionReader();
    }
    async run() {
        if (this.settings.solution) {
            var allPackages = [];
            const projects = await this.solutionReader.getProjects(this.settings.solution);
            const solutionDir = path.parse(this.settings.solution).dir;
            for (let project of projects) {
                const dir = path.parse(path.join(solutionDir, project.relativePath)).dir;
                const packages = await this.readProject(dir);
                allPackages.push(...packages);
            }
            // distinct and sort
            allPackages = allPackages.filter((obj, pos, arr) => {
                return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
            }).sort((current, next) => current.id.localeCompare(next.id));
            const packageDependencies = await this.processXmlPackages(allPackages, this.settings.solution);
            return allPackages;
        }
        const packages = await this.readProject(this.settings.dir);
        const packageDependencies = await this.processXmlPackages(packages, "TEST");
        return packages;
    }
    async readProject(dir) {
        var packageReferenceList = await this.packageReference.list(dir);
        var packageConfigList = await this.packageConfig.list(dir);
        return packageReferenceList.concat(packageConfigList).sort((current, next) => current.id.localeCompare(next.id));
    }
    async processXmlPackages(packageList, fileName) {
        if (!(packageList && packageList.length))
            return null;
        const packageFolder = "C:/Projects/Picturepark/packages";
        if (!packageFolder) {
            console.log("Cannot find 'packages' directory. Have you run 'nuget restore'?");
            return null;
        }
        if (!this.settings.showSystem) {
            packageList = packageList.filter(x => x.id.indexOf('System.') !== 0);
        }
        const packageDictionary = {};
        packageList.forEach(x => {
            packageDictionary[x.id] = x;
            x.label = x.id + " " + (this.settings.hideVersion ? "" : x.version.green);
        });
        for (const x of packageList) {
            x.nodes = x.nodes || [];
            (await this.nuGetPackageReader.read(packageFolder, x) || []).forEach(dep => {
                var resolvedDep = packageDictionary[dep.id];
                if (resolvedDep) {
                    if (x.nodes.filter(x => x.id === dep.id).length)
                        return; // already added
                    x.nodes.push(resolvedDep);
                    resolvedDep.used = true;
                }
                else {
                    //dep.id is missing from package.config, at the moment we're not observing targets
                }
            });
        }
        this.displayPackages(packageList, fileName);
        return packageDictionary;
    }
    displayPackages(packages, source) {
        if (this.settings.why) {
            let head = {
                id: "",
                label: source,
                match: true,
                nodes: packages.filter(x => !x.used)
            };
            //findWhy(head);
            //filterOnlyMatches(head);
            console.log(archy(head));
        }
        else if (this.settings.onlyTopLevel) {
            packages.filter(x => !x.used).forEach(x => {
                console.log(x.label);
            });
        }
        else if (this.settings.flat) {
            packages.forEach(x => {
                console.log(x.label);
            });
        }
        else {
            let head = {
                label: source,
                nodes: packages.filter(x => !x.used)
            };
            console.log(archy(head));
        }
    }
}
exports.NuGetTree = NuGetTree;
//# sourceMappingURL=NuGetTree.js.map