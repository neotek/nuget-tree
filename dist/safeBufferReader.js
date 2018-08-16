"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SafeBufferReader {
    read(buffer) {
        if (buffer.length === 0)
            return "";
        if (buffer[0] === 255 && buffer[1] === 254) {
            // byte order mark indicates utf16
            return buffer.toString("utf16le");
        }
        else {
            // otherwise assume utf8
            return buffer.toString();
        }
    }
}
exports.SafeBufferReader = SafeBufferReader;
//# sourceMappingURL=safeBufferReader.js.map