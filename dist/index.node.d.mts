//#region src/services/FileSystemService.d.ts
export declare const existsInside: (child: string, parent: string) => boolean;
export declare function exists(path: string): Promise<boolean>;
//#endregion
//#region src/services/PackageService.d.ts
export declare function findPackagePath(path?: string): Promise<string | undefined>;
//#endregion