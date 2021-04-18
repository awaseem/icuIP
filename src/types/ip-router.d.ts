// IP-Router has no Typescript typings, so these are maintained by us for the forseeable future
// After work, will open a PR into the library to share types

declare class IPRouter {
  constructor()

  insert(src: string, dest: any): boolean
  erase(src: string): boolean
  clear(): void
  find(src: string): string | undefined
  findRoutes(
    src: string,
  ): ReadonlyArray<{
    readonly src: string
    readonly dest: any
  }>
  route(src: string): string | undefined
  size(): number
  toDict(): Record<string, any>
  fromDict(
    dict: Record<string, any>,
  ): ReadonlyArray<{
    readonly src: string
    readonly dest: any
  }>
}

declare module 'ip-router' {
  export = IPRouter
}
