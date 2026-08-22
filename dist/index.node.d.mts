//#region src/services/FileSystemService.d.ts
declare function exists(path: string): Promise<boolean>;
//#endregion
//#region src/services/PackageService.d.ts
declare function findPackagePath(path?: string): Promise<string | undefined>;
//#endregion
export { exists, findPackagePath };