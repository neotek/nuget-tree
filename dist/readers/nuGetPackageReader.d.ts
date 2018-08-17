import { IPackage } from '../interfaces/package';
import { ReaderBase } from './readerBase';
export declare class NuGetPackageReader extends ReaderBase {
    nuGet3Dir: string;
    constructor();
    read(packagesFolder: string, nuGetPackage: IPackage): Promise<IPackage[]>;
    readAllDeps(data: any): any[];
    openNuspecFile(packageFilePath: string): any;
}
