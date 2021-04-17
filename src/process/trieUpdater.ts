import { Trie } from '../models/trie'
import config from '../config/fireholLists.json'
import { BlockListIP } from '../models/blockLists'

export interface TrieUpdater {
  readonly update: () => Promise<void>
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

    ips.forEach((ip) => trie.insert(ip, fileName))
  }

  async function update(): Promise<void> {
    const updatePromises = config.map((data) =>
      updateTrieForFile(data.name, data.url),
    )
    await Promise.all(updatePromises)
  }

  return Object.freeze({
    update,
  })
}
