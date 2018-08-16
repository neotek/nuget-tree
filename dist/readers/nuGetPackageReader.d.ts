import { IPackage } from '../interfaces/package';
import { ReaderBase } from './readerBase';
export declare class NuGetPackageReader extends ReaderBase {
    read(packagesFolder: string, nuGetPackage: IPackage): Promise<IPackage[]>;
    readAllDeps(nuspecXml: string): Promise<any>;
    openNuspecFile(packageFilePath: string): any;
}
