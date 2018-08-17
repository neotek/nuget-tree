"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const NuGetTree_1 = require("./NuGetTree");
var settings = settings_1.Settings.read();
var nuGetTree = new NuGetTree_1.NuGetTree(settings);
nuGetTree.run().then(result => console.log(result));
//# sourceMappingURL=app.js.map