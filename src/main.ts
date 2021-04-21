import config from './config/fireholLists.json'
import { createTrieUpdater } from './process/trieUpdater'
import { createServer } from './server/server'
import { createModels } from './models/models'

async function main(): Promise<void> {
  // Initialize models
  const { blockLists, trie } = createModels()

  // Initialize trie updater and fill trie with IPs
  const trieUpdater = createTrieUpdater(blockLists, trie)
  await trieUpdater.update(config)

  // Initialize server
  const server = createServer(trie)
  await server.start()

  // Starting polling for changes
  trieUpdater.pollingUpdate(config)
}

main()
