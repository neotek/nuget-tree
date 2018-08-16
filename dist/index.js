"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class Library {
    constructor() {
        this.test = "x";
        fs.readdir("c:\\", (error, files) => console.log(files));
    }
}
exports.Library = Library;
//# sourceMappingURL=index.js.map