import { Fetch } from './fetch'

interface BlockListIP {
  readonly getBlockListIps: (
    url: string,
  ) => Promise<readonly string[] | undefined>
}

export function createBlockListIP(fetcher: Fetch): BlockListIP {
  function isNotComment(line: string): boolean {
    return !line.startsWith('#')
  }

  async function getBlockListIps(
    url: string,
  ): Promise<readonly string[] | undefined> {
    const fileData = await fetcher.fetchFile(url)
    if (!fileData) {
      console.log(`Failed to find file data for url: ${url}`)
      return undefined
    }

    const fileLines = fileData.split('\n')

    // TODO add more validation for ip address w/ cidr matching
    const validIPs = fileLines.filter(isNotComment)
    return validIPs
  }

  return Object.freeze({
    getBlockListIps,
  })
}
