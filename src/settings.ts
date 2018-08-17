export interface ISettings {
    help: boolean;
    hideVersion: boolean;
    showSystem: boolean;
    onlyTopLevel: boolean;
    flat: boolean;
    why: string | null;
    dir: string | null;
    solution: string | null;
}

export class Settings {
    public static read(): ISettings {
        return {
            help: this.hasFlag('?') || this.hasFlag('h') || this.hasFlag('help'),
            hideVersion: this.hasFlag('hideVersion'),
            showSystem: this.hasFlag('showSystem'),
            onlyTopLevel: this.hasFlag('onlyTopLevel'),
            flat: this.hasFlag('flat'),
            why: this.hasValue('why'),
            dir: this.hasValue('dir'),
            solution: this.hasValue('solution')
        }
    }

    public static hasFlag(name: string): boolean {
        return !!process.argv.filter(x => x === '--' + name).length;
    }
    
    public static hasValue(name: string): string | null {
        var index = process.argv.indexOf('--' + name);
        if (index === -1)
            return null;
        return process.argv[index + 1];
    }
}