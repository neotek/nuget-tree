import * as fs from 'fs';
import { ReaderBase } from './readerBase';

export interface IProject {
    guid: string;
    name: string;
    relativePath: string;
}

export class SolutionReader extends ReaderBase {
    async getProjects(filePath: string): Promise<IProject[]> {
        const solution = this.readSafe(fs.readFileSync(filePath));
        const projects: IProject[] = [];
        solution.split(/\r?\n/).forEach(line => {
            const matcher = /Project\(\"(.*?)\"\) = \"(.*?)\", \"(.*?)\", \"(.*?)/g;
            const matches = matcher.exec(line);
            if(matches !== null && matches[3].indexOf(".csproj") !== -1) {
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