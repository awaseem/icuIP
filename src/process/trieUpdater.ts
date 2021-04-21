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

  async function getBlockListsForConfig(
    config: readonly UpdateConfig[],
  ): Promise<ReadonlyArray<readonly string[]> | undefined> {
    const ipPromises = config.map((config) =>
      blockLists.getBlockListIps(config.url),
    )

    const ips = await Promise.all(ipPromises)
    const undefinedIndex = ips.findIndex((ip) => ip === undefined)
    if (undefinedIndex !== -1) {
      console.log(
        `File fetching failed for ${config[undefinedIndex].name} @ ${config[undefinedIndex].url}`,
      )
      return undefined
    }

    return ips as ReadonlyArray<readonly string[]>
  }

  function reduceBlockListsToMap(
    config: readonly UpdateConfig[],
    blockLists: ReadonlyArray<readonly string[]>,
  ): ReadonlyMap<string, string> {
    return blockLists.reduce((acc, curr, index) => {
      const fileName = config[index].name
      curr.forEach((val) => acc.set(val, fileName))
      return acc
    }, new Map<string, string>())
  }

  async function update(config: readonly UpdateConfig[]): Promise<void> {
    const blockLists = await getBlockListsForConfig(config)
    if (!blockLists) {
      return
    }

    const blockListMap = reduceBlockListsToMap(config, blockLists)
    const uniqueIps = Array.from(blockListMap.keys())

    const existingTrieDict = trie.toDict()
    const existingIps = Object.keys(existingTrieDict)

    const ipsToAdd = difference(uniqueIps, existingIps)
    const ipsToRemove = difference(existingIps, uniqueIps)

    ipsToAdd.forEach((ip) => addIP(ip, blockListMap.get(ip) ?? 'unknown'))
    ipsToRemove.forEach((ip) => removeIP(ip))

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
