"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nuGetTree_1 = require("./nuGetTree");
function init(settings) {
    return new nuGetTree_1.NuGetTree(settings).run();
}
exports.init = init;
async function initMany(solutions) {
    const promises = solutions.map(solution => new nuGetTree_1.NuGetTree({ solution: solution }).run());
    const results = await Promise.all(promises);
    // Reduce, distinct and sort
    return results.reduce((a, b) => a.concat(b), [])
        .filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
    }).sort((current, next) => current.id.localeCompare(next.id));
}
exports.initMany = initMany;
//# sourceMappingURL=main.js.map