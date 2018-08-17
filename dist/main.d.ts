import { ISettings } from "./settings";
import { IPackage } from "./interfaces/package";
export declare function init(settings: ISettings): Promise<IPackage[]>;
export declare function initMany(solutions: string[]): Promise<IPackage[]>;
