import { Fetch } from './fetch'
import isCidr from 'is-cidr'
import isIp from 'is-ip'

interface BlockListIP {
  readonly getBlockListIps: (
    url: string,
  ) => Promise<readonly string[] | undefined>
}

export function createBlockListIP(fetcher: Fetch): BlockListIP {
  function isNotComment(line: string): boolean {
    return !line.startsWith('#')
  }

  function isValidIp(line: string): boolean {
    return Boolean(isCidr(line)) || isIp(line)
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

    const validIPs = fileLines.filter(isNotComment).filter(isValidIp)
    return validIPs
  }

  return Object.freeze({
    getBlockListIps,
  })
}
