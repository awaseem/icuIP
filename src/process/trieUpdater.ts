import { Trie } from '../models/trie'
import { BlockListIP } from '../models/blockLists'
import { difference } from '../utils/array'

export interface TrieUpdater {
  readonly update: (config: readonly UpdateConfig[]) => Promise<void>
}

export interface UpdateConfig {
  readonly name: string
  readonly url: string
}

export function createTrieUpdater(
  blockLists: BlockListIP,
  trie: Trie,
): TrieUpdater {
  async function updateTrieForFile(
    fileName: string,
    fileUrl: string,
  ): Promise<void> {
    const ips = await blockLists.getBlockListIps(fileUrl)
    if (!ips) {
      console.log(
        `Failed to load ips into trie for the following file ${fileName} and url: ${fileUrl}`,
      )
      return
    }

    const existingTrieDict = trie.toDict()
    const existingIps = Object.keys(existingTrieDict).filter(
      (key) => existingTrieDict[key] === fileName,
    )

    const ipsToAdd = difference(ips, existingIps)
    const ipsToRemove = difference(existingIps, ips)

    ipsToAdd.forEach((ip) => trie.insert(ip, fileName))
    ipsToRemove.forEach((ip) => trie.remove(ip))
  }

  async function update(config: readonly UpdateConfig[]): Promise<void> {
    const updatePromises = config.map((data) =>
      updateTrieForFile(data.name, data.url),
    )
    await Promise.all(updatePromises)
  }

  return Object.freeze({
    update,
  })
}
