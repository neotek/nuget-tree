import { IPackage } from './interfaces/package';
export declare class PackageReference {
    list(dir: string): Promise<IPackage[]>;
    parseXml(xml: string): Promise<any>;
}
