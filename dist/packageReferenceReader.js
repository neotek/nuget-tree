"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const safeBufferReader_1 = require("./safeBufferReader");
const readerBase_1 = require("./readerBase");
class PackageReferenceReader extends readerBase_1.ReaderBase {
    async list(dir) {
        const files = fs.readdirSync(dir)
            .filter(file => file.toLowerCase().endsWith(".csproj") &&
            fs.existsSync(path.join(dir, file)));
        if (!files.length)
            return [];
        const file = path.join(dir, files[0]);
        const xml = new safeBufferReader_1.SafeBufferReader().read(fs.readFileSync(file));
        var parsedOutput = await this.parseXml(xml);
        if (!(parsedOutput && parsedOutput.Project && parsedOutput.Project && parsedOutput.Project.ItemGroup)) {
            return [];
        }
        try {
            let itemGroup = parsedOutput.Project.ItemGroup;
            if (!Array.isArray(itemGroup)) {
                itemGroup = [itemGroup];
            }
            return itemGroup.filter((a) => a && a.PackageReference).map((a) => a.PackageReference.map((x) => {
                return {
                    id: x.$.Include,
                    version: x.$.Version,
                    targetFramework: null
                };
            })).reduce((ret, cur) => ret.concat(cur), []);
        }
        catch (err) {
            throw `Cannot parse ${file}. Is it in a valid format?`;
        }
    }
}
exports.PackageReferenceReader = PackageReferenceReader;
//# sourceMappingURL=packageReferenceReader.js.map