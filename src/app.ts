import { PackageReferenceReader } from './readers/packageReferenceReader';
import { IPackage } from './interfaces/package';
import { PackagesConfigReader } from './readers/packagesConfigReader';
import { NuGetPackageReader } from './readers/nuGetPackageReader';

var reference = new PackageReferenceReader();
var packageConfig = new PackagesConfigReader();
var nuGetPackageReader = new NuGetPackageReader();

run().then(result => console.log(result));

async function run(): Promise<IPackage[]> {
    var frontend = await reference.list("C:/Projects/Picturepark/Picturepark.Frontend");

    var api = await packageConfig.list("C:/Projects/Picturepark/Picturepark.Api");

    var result = await nuGetPackageReader.read("C:/Projects/Picturepark/packages", api[0]);
    console.log(result);

    return frontend.concat(api).sort((current, next) => current.id.localeCompare(next.id));
}