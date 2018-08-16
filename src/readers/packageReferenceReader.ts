import * as fs from 'fs';
import * as path from 'path';
import { IPackage } from '../interfaces/package';
import { ReaderBase } from './readerBase';

export class PackageReferenceReader extends ReaderBase {
    async list(dir: string): Promise<IPackage[]> {
        const files = fs.readdirSync(dir)
            .filter(file => 
                file.toLowerCase().endsWith(".csproj") && 
                fs.existsSync(path.join(dir, file))
            );

        if (!files.length)
            return [];

        const file = path.join(dir, files[0]);
        const xml = this.readSafe(fs.readFileSync(file));

        var parsedOutput = await this.parseXml(xml);
        if (!(parsedOutput && parsedOutput.Project && parsedOutput.Project && parsedOutput.Project.ItemGroup)) {
            return [];
        }
        try {
            let itemGroup = parsedOutput.Project.ItemGroup;
            if (!Array.isArray(itemGroup)) {
                itemGroup = [itemGroup];
            }
            return itemGroup.filter((a: any) => a && a.PackageReference).map((a: any) => a.PackageReference.map((x: any) => {
                return {
                    id: x.$.Include,
                    version: x.$.Version,
                    targetFramework: null
                }
            })).reduce((ret: any, cur: any) => ret.concat(cur), []);
        } catch (err) {
            throw `Cannot parse ${file}. Is it in a valid format?`;
        }
    }
}