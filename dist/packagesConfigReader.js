"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const safeBufferReader_1 = require("./safeBufferReader");
const readerBase_1 = require("./readerBase");
class PackagesConfigReader extends readerBase_1.ReaderBase {
    async list(dir) {
        if (!fs.existsSync(path.join(dir, 'packages.config'))) {
            return [];
        }
        var xml = new safeBufferReader_1.SafeBufferReader().read(fs.readFileSync(path.join(dir, 'packages.config')));
        var parsedOutput = await this.parseXml(xml);
        try {
            return parsedOutput.packages.package.map((x) => {
                return {
                    id: x.$.id,
                    version: x.$.version,
                    targetFramework: x.$.targetFramework
                };
            });
        }
        catch (err) {
            throw "Cannot parse 'packages.config'. Is it in a valid format?";
        }
    }
}
exports.PackagesConfigReader = PackagesConfigReader;
//# sourceMappingURL=packagesConfigReader.js.map