import { NuGetTree } from "./nuGetTree";
import { ISettings } from "./settings";
import { IPackage } from "./interfaces/package";

export function init(settings: ISettings): Promise<IPackage[]>
{
    return new NuGetTree(settings).run();
}

export async function initMany(solutions: string[]): Promise<IPackage[]>
{
    const promises = solutions.map(solution => new NuGetTree( { solution: solution } as any).run());
    const results = await Promise.all(promises);

    // Reduce, distinct and sort
    return results.reduce((a, b) => a.concat(b), [])
        .filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
        }).sort((current, next) => current.id.localeCompare(next.id));
}