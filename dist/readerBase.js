"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xml2js_1 = require("xml2js");
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
}
exports.ReaderBase = ReaderBase;
//# sourceMappingURL=readerBase.js.map