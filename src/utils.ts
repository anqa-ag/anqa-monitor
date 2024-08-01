import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk'

const aptosConfig = new AptosConfig({ network: Network.MAINNET })
export const aptos = new Aptos(aptosConfig)

export const choice = (items: any[]): any => items[(items.length * Math.random()) | 0]

export const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
