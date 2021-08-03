import React from 'react'
import { Token } from '@uniswap/sdk'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { Result } from 'state/multicall/hooks'
import CurrencyLogo from 'components/CurrencyLogo'
import { NFTCardProps } from 'components/NFTCard'

export const formatNFTCardDetail = (
  nftId: string,
  nft: Result | undefined,
  tokens: {
    [address: string]: Token
  }
): NFTCardProps | undefined => {
  if (!nft) {
    return undefined
  }
  const metadata = JSON.parse(nft.metadata)
  const assets = nft.underlyingAmounts.map(
    (val: any, idx: number): React.ReactNode => {
      let _currencyToken = undefined
      if (tokens) {
        _currencyToken = tokens[val.currency] as WrappedTokenInfo
        if (!_currencyToken) _currencyToken = tokens[Object.keys(tokens)[0]] as WrappedTokenInfo
      }
      return <CurrencyLogo currency={tokens[nft.underlyingTokens[idx]]} key={idx} />
    }
  )

  return {
    id: nftId,
    name: nft.nam,
    indexId: nftId,
    color: metadata.color,
    address: nft.creator,
    icons: assets,
    creator: nft.creator
  }
}
