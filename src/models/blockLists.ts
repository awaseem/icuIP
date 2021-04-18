import { Fetch } from './fetch'
import isCidr from 'is-cidr'
import isIp from 'is-ip'

export interface BlockListIP {
  readonly getBlockListIps: (
    url: string,
    personalAuthToken?: string,
  ) => Promise<readonly string[] | undefined>
}

export function createBlockListIP(fetcher: Fetch): BlockListIP {
  function isNotComment(line: string): boolean {
    return !line.startsWith('#')
  }

  function trimWhiteSpace(line: string): string {
    return line.trim()
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

    const validIPs = fileLines
      .map(trimWhiteSpace)
      .filter(isNotComment)
      .filter(isValidIp)
    return validIPs
  }

  return Object.freeze({
    getBlockListIps,
  })
}
