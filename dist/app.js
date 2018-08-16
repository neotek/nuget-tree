"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packageReferenceReader_1 = require("./readers/packageReferenceReader");
const packagesConfigReader_1 = require("./readers/packagesConfigReader");
const nuGetPackageReader_1 = require("./readers/nuGetPackageReader");
var reference = new packageReferenceReader_1.PackageReferenceReader();
var packageConfig = new packagesConfigReader_1.PackagesConfigReader();
var nuGetPackageReader = new nuGetPackageReader_1.NuGetPackageReader();
run().then(result => console.log(result));
async function run() {
    var frontend = await reference.list("C:/Projects/Picturepark/Picturepark.Frontend");
    var api = await packageConfig.list("C:/Projects/Picturepark/Picturepark.Api");
    var result = await nuGetPackageReader.read("C:/Projects/Picturepark/packages", api[0]);
    console.log(result);
    return frontend.concat(api).sort((current, next) => current.id.localeCompare(next.id));
}
//# sourceMappingURL=app.js.map