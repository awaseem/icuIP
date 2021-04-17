import IPRouter from 'ip-router'

export interface Trie {
  readonly insert: (ip: string, data: string) => void
  readonly search: (ip: string) => string | undefined
}

export function createTrie(): Trie {
  const router = new IPRouter()

  function insert(ip: string, data: string): void {
    router.insert(ip, data)
  }

  function search(ip: string): string | undefined {
    return router.route(ip)
  }

  return Object.freeze({
    insert,
    search,
  })
}
