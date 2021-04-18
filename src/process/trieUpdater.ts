import { Trie } from '../models/trie'
import { BlockListIP } from '../models/blockLists'
import { difference } from '../utils/array'

const FIVE_MINUTES = 300000

export interface TrieUpdater {
  readonly update: (config: readonly UpdateConfig[]) => Promise<void>
  readonly pollingUpdate: (config: readonly UpdateConfig[]) => void
}

export interface UpdateConfig {
  readonly name: string
  readonly url: string
}

export function createTrieUpdater(
  blockLists: BlockListIP,
  trie: Trie,
): TrieUpdater {
  function addIP(ip: string, fileName: string): void {
    trie.insert(ip, fileName)
    console.log(`Added new IP: ${ip}`)
  }

  function removeIP(ip: string): void {
    trie.remove(ip)
    console.log(`Removed IP: ${ip}`)
  }

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

    ipsToAdd.forEach((ip) => addIP(ip, fileName))
    ipsToRemove.forEach((ip) => removeIP(ip))
  }

  async function update(config: readonly UpdateConfig[]): Promise<void> {
    const updatePromises = config.map((data) =>
      updateTrieForFile(data.name, data.url),
    )
    await Promise.all(updatePromises)

    console.log(`Updated Trie size is the following: ${trie.size()}`)
  }

  function pollingUpdate(config: readonly UpdateConfig[]): void {
    setInterval(() => update(config), FIVE_MINUTES)
  }

  return Object.freeze({
    update,
    pollingUpdate,
  })
}
