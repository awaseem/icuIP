import { createBlockListIP } from './models/blockLists'
import { createFetch } from './models/fetch'
import { createTrie } from './models/trie'
import { createTrieUpdater } from './process/trieUpdater'
import config from './config/fireholLists.json'

async function main(): Promise<void> {
  // initialize models
  const fetcher = createFetch()
  const trie = createTrie()
  const blockListIP = createBlockListIP(fetcher)

  // initialize processes
  const trieUpdater = createTrieUpdater(blockListIP, trie)

  // Update Trie
  await trieUpdater.update(config)

  // DEBUG: view data inserted to Trie
  trie.display()
}

main()
