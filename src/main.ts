import { config as dotenvConfig } from '@dotenvx/dotenvx'

import { randomInt, sleep } from './utils.js'
import monitorAggregator from './monitorAggregator.js'
import monitorTokenList from './monitorTokenList.js'

dotenvConfig()

export default async function main() {
  // process.env.MAX_SLEEP = "1000"
  console.log(`process.env.MAX_SLEEP`, process.env.MAX_SLEEP)
  while (true) {
    const sleepTime = randomInt(1_000, Number(process.env.MAX_SLEEP) || 3_000)
    console.log(`sleepTime`, sleepTime)
    await sleep(sleepTime)
    await monitorAggregator()
    if (sleepTime % 23 === 0) await monitorTokenList()
  }
}

main()
