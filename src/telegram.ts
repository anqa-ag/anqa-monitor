import TelegramBot from 'node-telegram-bot-api'

import { GetRouteResponseData } from './types.js'
import { addIgnoreToken, getIgnoreTokens, removeIgnoreToken } from './redis.js'
import { TOKEN_LIST_CHAT_ID } from './constants.js'
import monitorTokenList from './monitorTokenList.js'
import { InputEntryFunctionData } from '@aptos-labs/ts-sdk'

// Create a bot that uses 'polling' to fetch new updates
let bot: TelegramBot | undefined
if (process.env.ENABLE_TELEGRAM === 'true') {
  bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })
}

// Matches "/add [whatever]"
bot && bot.onText(/\/add (.+)/, async (msg, match) => {
  const chatId = msg.chat.id
  if (chatId !== Number(TOKEN_LIST_CHAT_ID)) return

  const id = match[1]

  try {
    addIgnoreToken(id)
    sendLongMessage(chatId, `Added ${id} to ignore token list.`)
  } catch (err) {
    sendLongMessage(chatId, err.stack)
  }
})

// Matches "/remove [whatever]"
bot && bot.onText(/\/remove (.+)/, async (msg, match) => {
  const chatId = msg.chat.id
  if (chatId !== Number(TOKEN_LIST_CHAT_ID)) return

  const id = match[1]

  try {
    removeIgnoreToken(id)
    sendLongMessage(chatId, `Removed ${id} from ignore token list.`)
  } catch (err) {
    sendLongMessage(chatId, err.stack)
  }
})

// Matches "/check"
bot && bot.onText(/\/check/, async (msg) => {
  const chatId = msg.chat.id
  if (chatId !== Number(TOKEN_LIST_CHAT_ID)) return

  try {
    await monitorTokenList()
  } catch (err) {
    sendLongMessage(chatId, err.stack)
  }
})

// Matches "/list"
bot && bot.onText(/\/list/, async (msg) => {
  const chatId = msg.chat.id
  if (chatId !== Number(TOKEN_LIST_CHAT_ID)) return

  try {
    const list = await getIgnoreTokens()
    sendLongMessage(chatId, list.join('\n\n') || 'Ignore token list: Empty')
  } catch (err) {
    sendLongMessage(chatId, err.stack)
  }
})

bot && bot.on('polling_error', (msg) => console.log(msg))

export async function sendLongMessage(chatId: string | number, msg: string) {
  if (!bot) return

  const chunkSize = 4096
  for (let i = 0; i < msg.length; i += chunkSize) {
    const chunk = msg.slice(i, i + chunkSize)
    await bot.sendMessage(chatId, chunk)
  }
}

export async function sendAggregatorResultMessage(args: {
  tokenIn: string | undefined
  tokenOut: string | undefined
  amountIn: number | undefined
  getRouteError: string | undefined
  getRouteResponseData: GetRouteResponseData | undefined
  swapData: InputEntryFunctionData | undefined
  isSimulateSuccess: boolean | undefined
  vmStatus: string | undefined
  unknownError: any
  extra: any
}) {
  console.log(new Date().toISOString(), args)

  if (!bot) return

  if (args.getRouteError !== undefined || args.isSimulateSuccess == false || args.unknownError !== undefined) {
    await bot.sendMessage(process.env.ANQA_MONITOR_CHAT_ID, `============ ❌❌❌ Error Start ❌❌❌ ============`)
    const msg = JSON.stringify(
      {
        tokenIn: args.tokenIn,
        tokenOut: args.tokenOut,
        amountIn: args.amountIn,
        getRouteError: args.getRouteError,
        getRouteResponseData: JSON.stringify(args.getRouteResponseData),
        swapData: JSON.stringify(args.swapData),
        isSimulateSuccess: args.isSimulateSuccess,
        vmStatus: args.vmStatus,
        unknownError: args.unknownError,
        extra: JSON.stringify(args.extra),
      },
      null,
      4,
    )
    await sendLongMessage(process.env.ANQA_MONITOR_CHAT_ID, msg)
    await bot.sendMessage(process.env.ANQA_MONITOR_CHAT_ID, `============ ❌❌❌ Error End ❌❌❌ ============`)
    return
  }
  // await bot.sendMessage(
  //   process.env.ANQA_MONITOR_CHAT_ID,
  //   `============ ✅ ============\n` +
  //     JSON.stringify(
  //       {
  //         tokenIn: args.tokenIn,
  //         tokenOut: args.tokenOut,
  //         amountIn: args.amountIn,
  //         amountOut: args.getRouteResponseData.amountOut,
  //       },
  //       null,
  //       4,
  //     ),
  // )
}
