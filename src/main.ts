import config from './config/fireholLists.json'
import { createTrieUpdater } from './process/trieUpdater'
import { createServer } from './server/server'
import { createModels } from './models/models'

async function main(): Promise<void> {
  // initialize models
  const { blockLists, trie } = createModels()

  // initialize trie updater and fill trie with IPs
  const trieUpdater = createTrieUpdater(blockLists, trie)
  await trieUpdater.update(config)

  // initialize server
  const server = createServer(trie)
  await server.start()

  // Starting polling for changes
  trieUpdater.pollingUpdate(config)
}

main()
