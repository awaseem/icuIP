import IPRouter from 'ip-router'

export interface Trie {
  readonly insert: (ip: string, data: string) => void
  readonly search: (ip: string) => string | undefined
  readonly remove: (ip: string) => void
  readonly clear: () => void
  readonly toDict: () => Record<string, string>
  readonly size: () => number
  readonly display: () => void
}

export function createTrie(): Trie {
  const router = new IPRouter()

  function clear(): void {
    router.clear()
  }

  function insert(ip: string, data: string): void {
    router.insert(ip, data)
  }

  function search(ip: string): string | undefined {
    return router.route(ip)
  }

  function remove(ip: string): void {
    router.erase(ip)
  }

  function toDict(): Record<string, string> {
    return router.toDict()
  }

  function size(): number {
    return router.size()
  }

  // DEBUG: just added to display the active Trie
  function display(): void {
    console.log(JSON.stringify(router.toDict(), null, 2))
  }

  return Object.freeze({
    insert,
    clear,
    search,
    display,
    toDict,
    remove,
    size,
  })
}
