import { ISettings } from "./settings";
import { IPackage, IPackageDependency } from "./interfaces/package";
export declare class NuGetTree {
    private settings;
    private packageReference;
    private packageConfig;
    private nuGetPackageReader;
    private solutionReader;
    constructor(settings: ISettings);
    run(): Promise<IPackage[]>;
    readProject(dir: string): Promise<IPackage[]>;
    processXmlPackages(packageList: IPackage[], fileName: string): Promise<IPackageDependency | null>;
    displayPackages(packages: IPackage[], source: string): void;
}
