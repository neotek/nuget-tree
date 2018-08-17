import * as fs from 'fs';
import * as path from 'path';
import { IPackage } from '../interfaces/package';
import { ReaderBase } from './readerBase';
var zip = require('zip');

export class NuGetPackageReader extends ReaderBase {
    nuGet3Dir: string;
    constructor() {
        super();

        this.nuGet3Dir = path.join(require('os').homedir(), ".nuget/packages");
    }

    async read(packagesFolder: string, nuGetPackage: IPackage): Promise<IPackage[]> {
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

        return await this.readAllDeps(nuspecXml);
    }

    async readAllDeps(nuspecXml: string): Promise<any> {
        var dependencies: any[] = [];
        const data = await this.parseXml(nuspecXml);

        (data.package.metadata || []).forEach((metadata: any) => {
            (metadata.dependencies || []).forEach((dep: any) => {

                // if the nuget package targets multiple version, there are groups
                (dep.group || []).forEach((dep: any) => {
                    (dep.dependency || []).forEach((dep: any) => {
                        dependencies.push(dep.$);
                    })
                });

                // otherwise there are no groups
                (dep.dependency || []).forEach((dep: any) => {
                    dependencies.push(dep.$);
                })

            });
        });
        return dependencies;
    }

    openNuspecFile(packageFilePath: string): any {

        var pkgData = fs.readFileSync(packageFilePath);
        var reader = zip.Reader(pkgData);
        var nuspec;
        reader.forEach((entry: any, next: any) => {
            if (path.extname(entry._header.file_name) === ".nuspec"){
                nuspec = this.readSafe(entry.getData())
            }
        });
        return nuspec;
    }
}