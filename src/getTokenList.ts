import axios from 'axios'

import { AnqaToken, PanoraToken, RawCoinInfo } from './types.js'

export async function getAnqaTokenList(): Promise<[AnqaToken[] | undefined, string | undefined]> {
  try {
    const url = 'https://raw.githubusercontent.com/anqa-ag/aptos-coin-list/main/anqaTokenList.json'
    const response = await axios<AnqaToken[]>(url)
    if (response.status === 200) {
      return [response.data, undefined]
    }
    return [undefined, JSON.stringify(response.data)]
  } catch (err) {
    console.error(err)
    return [undefined, err.stack]
  }
}

export async function getPanoraTokenList(): Promise<[PanoraToken[] | undefined, string | undefined]> {
  try {
    const url = 'https://raw.githubusercontent.com/PanoraExchange/Aptos-Tokens/main/token-list.json'
    const response = await axios<PanoraToken[]>(url)
    if (response.status === 200) {
      return [response.data, undefined]
    }
    return [undefined, JSON.stringify(response.data)]
  } catch (err) {
    console.error(err)
    return [undefined, err.stack]
  }
}

export async function getHippoTokenList(): Promise<[RawCoinInfo[] | undefined, string | undefined]> {
  try {
    const url = 'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/src/defaultList.mainnet.json'
    const response = await axios<RawCoinInfo[]>(url)
    if (response.status === 200) {
      return [response.data, undefined]
    }
    return [undefined, JSON.stringify(response.data)]
  } catch (err) {
    console.error(err)
    return [undefined, err.stack]
  }
}
