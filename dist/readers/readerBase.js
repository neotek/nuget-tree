"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xml2js_1 = require("xml2js");
const safeBufferReader_1 = require("./safeBufferReader");
class ReaderBase {
    parseXml(xml) {
        return new Promise((resolve, reject) => {
            xml2js_1.parseString(xml, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    readSafe(buffer) {
        return new safeBufferReader_1.SafeBufferReader().read(buffer);
    }
}
exports.ReaderBase = ReaderBase;
//# sourceMappingURL=readerBase.js.map