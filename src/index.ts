import * as fs from 'fs';

export class Library {
    test: string = "x";

    constructor() {
        fs.readdir("c:\\", (error, files) => console.log(files) );
    }
}