import { IPackage } from './interfaces/package';
import { ReaderBase } from './readerBase';
export declare class PackagesConfigReader extends ReaderBase {
    list(dir: string): Promise<IPackage[]>;
}
