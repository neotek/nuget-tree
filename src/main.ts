import { NuGetTree } from "./nuGetTree";
import { ISettings } from "./settings";
import { IPackage } from "./interfaces/package";

export function init(settings: ISettings): Promise<IPackage[]>
{
    return new NuGetTree(settings).run();
}