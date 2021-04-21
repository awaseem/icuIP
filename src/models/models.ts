import { BlockListIP, createBlockListIP } from './blockLists'
import { Fetch, createFetch } from './fetch'
import { createTrie, Trie } from './trie'

export interface Models {
  readonly fetch: Fetch
  readonly trie: Trie
  readonly blockLists: BlockListIP
}

export function createModels(): Models {
  const fetch = createFetch()
  const trie = createTrie()
  const blockLists = createBlockListIP(fetch)

  return {
    fetch,
    trie,
    blockLists,
  }
}
