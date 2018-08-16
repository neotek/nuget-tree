import { IPackage } from './interfaces/package';
import { ReaderBase } from './readerBase';
export declare class PackageReferenceReader extends ReaderBase {
    list(dir: string): Promise<IPackage[]>;
}
