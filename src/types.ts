export interface GetRouteResponse {
  code: number
  message: string
  data: GetRouteResponseData
  requestId: string
}

export interface GetRouteResponseData {
  srcCoinType: string
  dstCoinType: string
  srcAmount: string
  dstAmount: string
  paths: GetRouteResponseDataPath[][]
}

export interface GetRouteResponseDataPath {
  poolId: string
  source: string
  sourceType: string
  srcCoinType: string
  dstCoinType: string
  srcAmount: string
  dstAmount: string
  metadata: {
    isXToY?: boolean
    isStable?: boolean
    tokenInIndex?: number
    tokenOutIndex?: number
    marketId?: number
    tokenInWeight?: number
    tokenOutWeight?: number
  }
}

export interface SwapArgs {
  tokenIn: string
  tokenOut: string
  amountIn: string // string of an integer
  amountOut: string // string of an integer
  amountInUsd: string
  amountOutUsd: string
  minAmountOut: string // string of an integer
  paths: GetRouteResponseDataPath[][]
}

export interface TokenType {
  type: string
  account_address: string
  module_name: string
  struct_name: string
}

export interface ExtensionType {
  data: [string, string][]
}

export interface RawCoinInfo {
  name: string
  symbol: string
  official_symbol: string
  coingecko_id: string
  decimals: number
  logo_url: string
  project_url: string
  token_type: TokenType
  extensions: ExtensionType
  unique_index: number
  source?: string
  hippo_symbol?: string
  pancake_symbol?: string
  permissioned_listing?: boolean
}

export interface PanoraToken {
  chainId: number
  tokenAddress: string
  name: string
  symbol: string
  decimals: number
  bridge?: string
  panoraSymbol: string
  logoUrl?: string
  websiteUrl?: string
  category: string
  isInPanoraTokenList: boolean
  isBanned: boolean
  panoraOrderIndex: number
  coingeckoId?: string
  coinMarketCapId?: number
}

export interface AnqaToken {
  id: string
  decimals: number
  name: string
  symbol: string
  logoUrl: string
}
