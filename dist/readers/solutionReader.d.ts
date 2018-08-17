import { ReaderBase } from './readerBase';
export interface IProject {
    guid: string;
    name: string;
    relativePath: string;
}
export declare class SolutionReader extends ReaderBase {
    getProjects(filePath: string): Promise<IProject[]>;
}
