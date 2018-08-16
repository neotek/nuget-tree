import * as fs from 'fs';
import * as path from 'path';
import { IPackage } from '../interfaces/package';
import { ReaderBase } from './readerBase';

export class PackagesConfigReader extends ReaderBase {
    async list(dir: string): Promise<IPackage[]> {
        if (!fs.existsSync(path.join(dir, 'packages.config'))) {
            return [];
        }
    
        var xml = this.readSafe(fs.readFileSync(path.join(dir, 'packages.config')));
    
        var parsedOutput = await this.parseXml(xml);
    
        try {
            return parsedOutput.packages.package.map((x: any) => {
                return {
                    id: x.$.id,
                    version: x.$.version,
                    targetFramework: x.$.targetFramework
                }
            });
        }
        catch(err){
            throw "Cannot parse 'packages.config'. Is it in a valid format?";
        }
    }
}