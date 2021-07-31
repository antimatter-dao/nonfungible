import { AssetsParameter } from 'components/Creation'
import { CardColor } from 'components/NFTCard'
import { useMemo } from 'react'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useAllTokens } from './Tokens'
import { useIndexNFTContract } from './useContract'
import { JSBI, TokenAmount } from '@uniswap/sdk'

export interface NFTIndexInfoProps {
  name: string
  description: string
  color: CardColor
  assetsParameters: AssetsParameter[]
  creator: string
  creatorId: string
  creatorName: string
}

function toNumber(weiValue: string, token: WrappedTokenInfo | undefined) {
  if (!token) return '--'
  return new TokenAmount(token, JSBI.BigInt(weiValue)).toSignificant()
}

export function useNFTIndexInfo(
  nftid: string | undefined
): {
  loading: boolean
  data: undefined | NFTIndexInfoProps
} {
  const contract = useIndexNFTContract()
  const nftIndexRes = useSingleCallResult(contract, 'getIndex', [nftid])
  const tokens = useAllTokens()

  return useMemo(() => {
    if (!nftIndexRes.result)
      return {
        loading: nftIndexRes.loading,
        data: undefined
      }
    const nft = nftIndexRes.result[0]
    const metadata = JSON.parse(nft.metadata)
    const assetsParameters = nft.underlyingAmounts.map(
      (val: any, index: number): AssetsParameter => {
        let _currencyToken = undefined
        if (tokens) {
          _currencyToken = tokens[val.currency] as WrappedTokenInfo
          if (!_currencyToken) _currencyToken = tokens[Object.keys(tokens)[0]] as WrappedTokenInfo
        }

        return {
          amount: toNumber(val.toString(), _currencyToken),
          currency: nft.underlyingTokens[index],
          currencyToken: _currencyToken
        }
      }
    )
    const ret = {
      name: nft.name,
      description: metadata.description,
      color: metadata.color,
      creator: nft.creator,
      creatorId: nftid as string,
      creatorName: 'jack',
      assetsParameters
    }
    return {
      loading: nftIndexRes.loading,
      data: ret
    }
  }, [nftIndexRes, nftid, tokens])
}

export function useAssetsTokens(assetsParameters: AssetsParameter[] | undefined): AssetsParameter[] {
  const tokens = useAllTokens()

  return useMemo(() => {
    if (!tokens || !assetsParameters) return []
    return assetsParameters.map(item => {
      // if (!Object.keys(tokens).includes(item.currency)) return []
      item.currencyToken = tokens[item.currency] as WrappedTokenInfo
      // if (!item.currencyToken) item.currencyToken = tokens[Object.keys(tokens)[0]] as WrappedTokenInfo
      return { ...item }
    })
  }, [tokens, assetsParameters])
}
