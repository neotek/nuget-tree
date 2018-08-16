/// <reference types="node" />
export declare abstract class ReaderBase {
    parseXml(xml: string): Promise<any>;
    readSafe(buffer: Buffer): string;
}
