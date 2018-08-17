"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const readerBase_1 = require("./readerBase");
class SolutionReader extends readerBase_1.ReaderBase {
    async getProjects(filePath) {
        const solution = this.readSafe(fs.readFileSync(filePath));
        const projects = [];
        solution.split(/\r?\n/).forEach(line => {
            const matcher = /Project\(\"(.*?)\"\) = \"(.*?)\", \"(.*?)\", \"(.*?)/g;
            const matches = matcher.exec(line);
            if (matches !== null && matches[3].indexOf(".csproj") !== -1) {
                projects.push({
                    guid: matches[1],
                    name: matches[2],
                    relativePath: matches[3]
                });
            }
        });
        return projects;
    }
}
exports.SolutionReader = SolutionReader;
//# sourceMappingURL=solutionReader.js.map