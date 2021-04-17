import { createBlockListIP } from './models/blockLists'
import { createFetch } from './models/fetch'

async function main(): Promise<void> {
  const fetch = createFetch()
  const blockLists = createBlockListIP(fetch)

  console.log(
    await blockLists.getBlockListIps(
      'https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_level1.netset',
    ),
  )
}

main()
