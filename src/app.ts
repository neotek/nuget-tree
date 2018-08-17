import { Settings } from './settings';
import { NuGetTree } from './NuGetTree';

var settings = Settings.read();
var nuGetTree = new NuGetTree(settings);

nuGetTree.run().then(result => console.log(result));

