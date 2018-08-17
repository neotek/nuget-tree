import { ISettings } from "./settings";
import { IPackage, IPackageDependency } from "./interfaces/package";
import { PackageReferenceReader } from "./readers/packageReferenceReader";
import { PackagesConfigReader } from "./readers/packagesConfigReader";
import { NuGetPackageReader } from "./readers/nuGetPackageReader";
import { SolutionReader } from "./readers/solutionReader";
var colors = import('colors');
import * as archy from 'archy';
import * as path from 'path';

export class NuGetTree {
    private packageReference = new PackageReferenceReader();
    private packageConfig = new PackagesConfigReader();
    private nuGetPackageReader = new NuGetPackageReader();
    private solutionReader = new SolutionReader();

    constructor(private settings: ISettings) {
    }

    async run(): Promise<IPackage[]> {
        if(this.settings.solution) {
            var allPackages: IPackage[] = [];
            const projects = await this.solutionReader.getProjects(this.settings.solution);
            const solutionDir = path.parse(this.settings.solution).dir;
            for(let project of projects) {
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

        const packages = await this.readProject(this.settings.dir!);
        const packageDependencies = await this.processXmlPackages(packages, "TEST");

        return packages;
    }

    async readProject(dir: string): Promise<IPackage[]> {
        var packageReferenceList = await this.packageReference.list(dir);
        var packageConfigList = await this.packageConfig.list(dir);

        return packageReferenceList.concat(packageConfigList).sort((current, next) => current.id.localeCompare(next.id));
    }

    async processXmlPackages(packageList: IPackage[], fileName: string): Promise<IPackageDependency | null> {
        if (!(packageList && packageList.length))
            return null;
        
        const packageFolder = "C:/Projects/Picturepark/packages";
        if (!packageFolder) {
            console.log("Cannot find 'packages' directory. Have you run 'nuget restore'?");
            return null;
        }
        if (!this.settings.showSystem) {
            packageList = packageList.filter(x => x.id.indexOf('System.') !== 0)
        }
    
        const packageDictionary: IPackageDependency = {};
        packageList.forEach(x => {
            packageDictionary[x.id] = x;
            x.label = x.id + " " + (this.settings.hideVersion ? "" : x.version.green);
        });
    
        for(const x of packageList) {
            x.nodes = x.nodes || [];
            (await this.nuGetPackageReader.read(packageFolder, x) || []).forEach(dep => {
    
                var resolvedDep = packageDictionary[dep.id];
                if (resolvedDep) {
                    if (x.nodes.filter(x => x.id === dep.id).length) return; // already added
    
                    x.nodes.push(resolvedDep);
                    resolvedDep.used = true;
                } else {
                    //dep.id is missing from package.config, at the moment we're not observing targets
                }
            });
        }

        this.displayPackages(packageList, fileName);

        return packageDictionary;
    }

    displayPackages(packages: IPackage[], source: string): void {

        if (this.settings.why){
          let head = {
              id :"",
              label: source,
              match: true,
              nodes: packages.filter(x => !x.used)
          };
          //findWhy(head);
          //filterOnlyMatches(head);
          console.log(archy(head));
        } else if (this.settings.onlyTopLevel) {
            packages.filter(x => !x.used).forEach(x => {
                console.log(x.label);
            });
        } else if (this.settings.flat) {
            packages.forEach(x => {
                console.log(x.label);
            });
        } else {
            let head: any = {
                label: source,
                nodes: packages.filter(x => !x.used)
            };
            console.log(archy(head));
        }
    }
   
}