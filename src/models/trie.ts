import IPRouter from 'ip-router'

export interface Trie {
  readonly insert: (ip: string, data: string) => void
  readonly search: (ip: string) => string | undefined
  readonly display: () => void
}

export function createTrie(): Trie {
  const router = new IPRouter()

  function insert(ip: string, data: string): void {
    router.insert(ip, data)
  }

  function search(ip: string): string | undefined {
    return router.route(ip)
  }

  // DEBUG: just added to display the active Trie
  function display(): void {
    console.log(JSON.stringify(router.toDict(), null, 2))
  }

  return Object.freeze({
    insert,
    search,
    display,
  })
}
