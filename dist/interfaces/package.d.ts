export interface IPackage {
    id: string;
    version: any;
    targetFramework: string;
    licenseUrl: string;
    projectUrl: string;
    label: string;
    nodes: IPackage[];
    used: boolean;
}
export interface IPackageDependency {
    [index: string]: IPackage;
}
