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
export declare class Settings {
    static read(): ISettings;
    static hasFlag(name: string): boolean;
    static hasValue(name: string): string | null;
}
