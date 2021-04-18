import { createBlockListIP } from '../blockLists'

describe('blockList Tests', () => {
  const mockFetcher = {
    fetchFile: jest.fn(),
  }

  const blockList = createBlockListIP(mockFetcher)

  afterEach(() => {
    mockFetcher.fetchFile.mockReset()
  })

  it('should successfully parse all the IPs within the file (with whitespace)', async () => {
    const fileResponse = `0.0.0.0/8
    1.10.16.0/20
    1.19.0.0/16
    1.32.128.0/18
    2.56.192.0/22
    2.58.176.0/22`

    mockFetcher.fetchFile.mockReturnValueOnce(fileResponse)

    const actualIps = await blockList.getBlockListIps('test')
    expect(actualIps).toEqual([
      '0.0.0.0/8',
      '1.10.16.0/20',
      '1.19.0.0/16',
      '1.32.128.0/18',
      '2.56.192.0/22',
      '2.58.176.0/22',
    ])
  })

  it('should successfully parse all the IPs within the file (with no whitespace)', async () => {
    const fileResponse = `0.0.0.0/8
1.10.16.0/20
1.19.0.0/16
1.32.128.0/18
2.56.192.0/22
2.58.176.0/22`

    mockFetcher.fetchFile.mockReturnValueOnce(fileResponse)

    const actualIps = await blockList.getBlockListIps('test')
    expect(actualIps).toEqual([
      '0.0.0.0/8',
      '1.10.16.0/20',
      '1.19.0.0/16',
      '1.32.128.0/18',
      '2.56.192.0/22',
      '2.58.176.0/22',
    ])
  })

  it('should successfully parse all the IPs and ignore all the comments', async () => {
    const fileResponse = `
# firehol_level1
0.0.0.0/8
1.10.16.0/20
1.19.0.0/16
1.32.128.0/18
2.56.192.0/22
2.58.176.0/22`

    mockFetcher.fetchFile.mockReturnValueOnce(fileResponse)

    const actualIps = await blockList.getBlockListIps('test')
    expect(actualIps).toEqual([
      '0.0.0.0/8',
      '1.10.16.0/20',
      '1.19.0.0/16',
      '1.32.128.0/18',
      '2.56.192.0/22',
      '2.58.176.0/22',
    ])
  })

  it('should should only parse valid IP addresses', async () => {
    const fileResponse = `
# firehol_level1
0.0.0.0/8
amIAnIP?`

    mockFetcher.fetchFile.mockReturnValueOnce(fileResponse)

    const actualIps = await blockList.getBlockListIps('test')
    expect(actualIps).toEqual(['0.0.0.0/8'])
  })

  it('return nothing if file is undefined', async () => {
    const fileResponse = undefined

    mockFetcher.fetchFile.mockReturnValueOnce(fileResponse)

    const actualIps = await blockList.getBlockListIps('test')
    expect(actualIps).toEqual(undefined)
  })
})
