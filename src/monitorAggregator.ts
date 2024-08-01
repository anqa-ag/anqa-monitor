import { APTOS_COIN, Ed25519PublicKey } from '@aptos-labs/ts-sdk'

import { getSwapData } from '@anqa-ag/ts-sdk'
import { APT_AMOUNTS, SLIPPAGE_BPS, TEST_PUBLIC_KEY, TEST_WALLET_ADDRESS } from './constants.js'
import { getAnqaTokenList } from './getTokenList.js'
import { sendAggregatorResultMessage } from './telegram.js'
import { aptos, choice } from './utils.js'

export default async function monitorAggregator() {
  const amountIn = choice(APT_AMOUNTS) * 1e8
  try {
    const [anqaTokenList, getAnqaTokenListError] = await getAnqaTokenList()
    if (!anqaTokenList) {
      await sendAggregatorResultMessage({
        tokenIn: APTOS_COIN,
        tokenOut: undefined,
        amountIn: undefined,
        getRouteError: undefined,
        getRouteResponseData: undefined,
        swapData: undefined,
        isSimulateSuccess: undefined,
        vmStatus: undefined,
        unknownError: getAnqaTokenListError,
        extra: undefined,
      })
      return
    }

    const tokenOut = choice(anqaTokenList.slice(1).map((token) => token.id))
    console.log(`tokenOut`, tokenOut)

    const swapData = await getSwapData({
      tokenIn: APTOS_COIN,
      tokenOut,
      amountIn: amountIn.toString(),
      slippageBps: SLIPPAGE_BPS,
      feeRecipient: TEST_WALLET_ADDRESS,
      feeBps: 0,
      chargeFeeBy: 'token_in',
    })

    const transaction = await aptos.transaction.build.simple({
      sender: TEST_WALLET_ADDRESS,
      data: {
        function: swapData.function,
        functionArguments: swapData.functionArguments,
        typeArguments: swapData.typeArguments,
      },
    })

    const simulateResponse = await aptos.transaction.simulate.simple({
      signerPublicKey: new Ed25519PublicKey(TEST_PUBLIC_KEY),
      transaction,
    })
    if (simulateResponse.length !== 1) {
      await sendAggregatorResultMessage({
        tokenIn: APTOS_COIN,
        tokenOut,
        amountIn,
        getRouteError: undefined,
        getRouteResponseData: undefined,
        swapData,
        isSimulateSuccess: undefined,
        vmStatus: undefined,
        unknownError: 'WTF why simulateResponse.length !== 1???',
        extra: {
          simulateResponse,
        },
      })
      return
    }

    await sendAggregatorResultMessage({
      tokenIn: APTOS_COIN,
      tokenOut,
      amountIn,
      getRouteError: undefined,
      getRouteResponseData: undefined,
      swapData,
      isSimulateSuccess: simulateResponse[0].success,
      vmStatus: simulateResponse[0].vm_status,
      unknownError: undefined,
      extra: undefined,
    })
  } catch (err) {
    console.error(err)
    await sendAggregatorResultMessage({
      tokenIn: APTOS_COIN,
      tokenOut: undefined,
      amountIn,
      getRouteError: undefined,
      getRouteResponseData: undefined,
      swapData: undefined,
      isSimulateSuccess: undefined,
      vmStatus: undefined,
      unknownError: err,
      extra: undefined,
    })
  }
}
