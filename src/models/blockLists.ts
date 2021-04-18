import { Fetch } from './fetch'
import isCidr from 'is-cidr'
import { v4 } from 'is-ip'

export interface BlockListIP {
  readonly getBlockListIps: (
    url: string,
  ) => Promise<readonly string[] | undefined>
}

export function createBlockListIP(fetcher: Fetch): BlockListIP {
  function isNotComment(line: string): boolean {
    return !line.startsWith('#')
  }

  function trimWhiteSpace(line: string): string {
    return line.trim()
  }

  function isValidIpV4(line: string): boolean {
    return Boolean(isCidr(line)) || v4(line)
  }

  function addMaskIfNeeded(ip: string): string {
    const [ipAddr, mask] = ip.split('/')
    if (!mask) {
      return `${ipAddr}/32`
    }

    return ip
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
      .filter(isValidIpV4)
      .map(addMaskIfNeeded)
    return validIPs
  }

  return Object.freeze({
    getBlockListIps,
  })
}
