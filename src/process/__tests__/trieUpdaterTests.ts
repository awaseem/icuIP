import { createTrie } from '../../models/trie'
import { createTrieUpdater } from '../trieUpdater'

describe('Trie Updater Process Tests', () => {
  const trie = createTrie()

  const mockBlockList = {
    getBlockListIps: jest.fn(),
  }

  const updater = createTrieUpdater(mockBlockList, trie)

  beforeEach(() => {
    mockBlockList.getBlockListIps.mockReset()
    trie.clear()
  })

  it('should have no problems adding exactly what block lists returns when trie is empty', async () => {
    mockBlockList.getBlockListIps.mockReturnValue([
      '1.0.0.0/32',
      '2.0.0.0/32',
      '3.0.0.0/32',
    ])

    const expectedTrie = createTrie()
    expectedTrie.insert('1.0.0.0/32', 'test')
    expectedTrie.insert('2.0.0.0/32', 'test')
    expectedTrie.insert('3.0.0.0/32', 'test')

    await updater.update([
      {
        name: 'test',
        url: 'https://test',
      },
    ])

    expect(trie.toDict()).toEqual(expectedTrie.toDict())
  })

  it('should delete all entries since the file is empty', async () => {
    trie.insert('1.0.0.0/32', 'test')
    trie.insert('2.0.0.0/32', 'test')
    trie.insert('3.0.0.0/32', 'test')

    mockBlockList.getBlockListIps.mockReturnValue([])
    const expectedTrie = createTrie()

    await updater.update([
      {
        name: 'test',
        url: 'https://test',
      },
    ])

    expect(trie.toDict()).toEqual(expectedTrie.toDict())
  })

  it('should insert a new entry and delete all others', async () => {
    trie.insert('1.0.0.0/32', 'test')
    trie.insert('2.0.0.0/32', 'test')
    trie.insert('3.0.0.0/32', 'test')

    mockBlockList.getBlockListIps.mockReturnValue(['4.0.0.0/32'])

    const expectedTrie = createTrie()
    expectedTrie.insert('4.0.0.0/32', 'test')

    await updater.update([
      {
        name: 'test',
        url: 'https://test',
      },
    ])

    expect(trie.toDict()).toEqual(expectedTrie.toDict())
  })

  it('should only delete 3.0.0.0', async () => {
    trie.insert('1.0.0.0/32', 'test')
    trie.insert('2.0.0.0/32', 'test')
    trie.insert('3.0.0.0/32', 'test')

    mockBlockList.getBlockListIps.mockReturnValue([
      '1.0.0.0/32',
      '2.0.0.0/32',
      '4.0.0.0/32',
    ])

    const expectedTrie = createTrie()
    expectedTrie.insert('1.0.0.0/32', 'test')
    expectedTrie.insert('2.0.0.0/32', 'test')
    expectedTrie.insert('4.0.0.0/32', 'test')

    await updater.update([
      {
        name: 'test',
        url: 'https://test',
      },
    ])

    expect(trie.toDict()).toEqual(expectedTrie.toDict())
  })
})
