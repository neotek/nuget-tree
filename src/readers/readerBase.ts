import { parseString } from 'xml2js';
import { SafeBufferReader } from './safeBufferReader';

export abstract class ReaderBase {
    parseXml(xml: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            parseString(xml, function (err, result) {
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    readSafe(buffer: Buffer): string {
        return new SafeBufferReader().read(buffer);
    }
}