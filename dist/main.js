"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nuGetTree_1 = require("./nuGetTree");
function init(settings) {
    return new nuGetTree_1.NuGetTree(settings).run();
}
exports.init = init;
//# sourceMappingURL=main.js.map