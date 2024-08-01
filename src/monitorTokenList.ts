import { TOKEN_LIST_CHAT_ID } from './constants.js'
import { getAnqaTokenList, getHippoTokenList, getPanoraTokenList } from './getTokenList.js'
import { getIgnoreTokens } from './redis.js'
import { sendLongMessage } from './telegram.js'
import { PanoraToken, RawCoinInfo } from './types.js'

export default async function monitorTokenList() {
  const [anqaTokenList, getAnqaTokenListError] = await getAnqaTokenList()
  if (!anqaTokenList) {
    const msg = JSON.stringify({ list: 'anqa', error: getAnqaTokenListError })
    await sendLongMessage(TOKEN_LIST_CHAT_ID, msg)
    return
  }
  const anqaTokenAddresses = anqaTokenList.map((token) => token.id)

  const ignoreTokens = await getIgnoreTokens()

  const [panoraTokenList, getPanoraTokenListError] = await getPanoraTokenList()
  if (!panoraTokenList) {
    const msg = JSON.stringify({ list: 'panora', error: getPanoraTokenListError })
    await sendLongMessage(TOKEN_LIST_CHAT_ID, msg)
    return
  }
  const missingPanoraTokens = new Set<PanoraToken>()
  for (let i = 0; i < panoraTokenList.length; i++) {
    if (!ignoreTokens.includes(panoraTokenList[i].tokenAddress) && !anqaTokenAddresses.includes(panoraTokenList[i].tokenAddress)) {
      missingPanoraTokens.add(panoraTokenList[i])
    }
  }
  await sendLongMessage(TOKEN_LIST_CHAT_ID, `🟡🟡🟡 MISSING ${missingPanoraTokens.size} TOKENS FROM PANORA 🟡🟡🟡`)
  await sendLongMessage(
    TOKEN_LIST_CHAT_ID,
    Array.from(missingPanoraTokens)
      .map((token) => `${token.symbol} - ${token.tokenAddress}`)
      .join('\n\n'),
  )

  const [hippoTokenList, getHippoTokenListError] = await getHippoTokenList()
  if (!hippoTokenList) {
    const msg = JSON.stringify({ list: 'hippo', error: getHippoTokenListError })
    await sendLongMessage(TOKEN_LIST_CHAT_ID, msg)
    return
  }
  const missingHippoTokens = new Set<RawCoinInfo>()
  for (let i = 0; i < hippoTokenList.length; i++) {
    if (!ignoreTokens.includes(hippoTokenList[i].token_type.type) && !anqaTokenAddresses.includes(hippoTokenList[i].token_type.type)) {
      missingHippoTokens.add(hippoTokenList[i])
    }
  }
  await sendLongMessage(TOKEN_LIST_CHAT_ID, `🟢🟢🟢 MISSING ${missingHippoTokens.size} TOKENS FROM HIPPO 🟢🟢🟢`)
  await sendLongMessage(
    TOKEN_LIST_CHAT_ID,
    Array.from(missingHippoTokens)
      .map((token) => `${token.symbol} - ${token.token_type.type}`)
      .join('\n\n'),
  )
}
