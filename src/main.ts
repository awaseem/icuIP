import config from './config/fireholLists.json'
import { createBlockListIP } from './models/blockLists'
import { createFetch } from './models/fetch'
import { createTrie } from './models/trie'
import { createTrieUpdater } from './process/trieUpdater'
import { createServer, registerPlugins } from './server/server'
import { addStatusRoute } from './routes/status'
import { addIpCheckRoute } from './routes/checkIP'

const DEFAULT_PORT = 8080
const DEFAULT_ADDRESS = '0.0.0.0'

async function main(): Promise<void> {
  // initialize models
  const fetcher = createFetch()
  const trie = createTrie()
  const blockListIP = createBlockListIP(fetcher)

  // initialize processes
  const trieUpdater = createTrieUpdater(blockListIP, trie)

  // Build server
  const server = createServer()

  // Apply middleware
  await registerPlugins(server)

  // Add routes
  addStatusRoute(server)
  addIpCheckRoute(server, trie)

  // Update Trie
  await trieUpdater.update(config)

  // Starting polling for changes
  trieUpdater.pollingUpdate(config)

  // Start the server
  const port = process.env.ICUIP_PORT
    ? Number(process.env.ICUIP_PORT)
    : DEFAULT_PORT
  const address = process.env.ICUIP_ADDRESS ?? DEFAULT_ADDRESS

  const url = await server.listen(port, address)
  console.log(`Server listening at ${url}`)
}

main()
