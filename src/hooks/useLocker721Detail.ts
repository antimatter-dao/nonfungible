import { AssetsParameter } from 'components/Creation'
import { CardColor } from 'components/NFTCard'
import { useMemo } from 'react'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useAllTokens } from './Tokens'
import { useLocker721NFTContract } from './useContract'
import { JSBI, TokenAmount } from '@uniswap/sdk'

interface NFTIndexInfoProps {
  name: string
  description: string
  color: CardColor
  assetsParameters: AssetsParameter[]
  creator: string
  creatorId: string
}
export interface UnClaimListProps {
  token: string
  amount: string
  claimAt: string
  claimed: boolean
  canClaim: boolean
  currencyToken?: WrappedTokenInfo
}

function toNumber(weiValue: string, token: WrappedTokenInfo | undefined) {
  if (!token) return '--'
  return new TokenAmount(token, JSBI.BigInt(weiValue)).toSignificant()
}

export function useLocker721Info(
  nftid: string | undefined
): {
  loading: boolean
  data: undefined | NFTIndexInfoProps
  unClaimList: (UnClaimListProps | undefined)[]
  isExist: boolean
} {
  const contract = useLocker721NFTContract()
  const tokens = useAllTokens()

  const nftIndexRes = useSingleCallResult(contract, 'getPool', [nftid])
  const claimLengthRes = useSingleCallResult(contract, 'getClaimLength', [nftid])

  const nftClaimIndex: (string | number)[][] = useMemo(() => {
    if (!claimLengthRes.result || !nftid) return []
    const ret = []
    let i = 0
    while (i < Number(claimLengthRes.result.toString())) {
      ret.push([nftid, i])
      i++
    }
    return ret
  }, [claimLengthRes.result, nftid])

  const claimRes = useSingleContractMultipleData(contract, 'getClaim', nftClaimIndex)
  const claimedRes = useSingleContractMultipleData(contract, 'claimed', nftClaimIndex)

  const unClaimList: (UnClaimListProps | undefined)[] = useMemo(() => {
    const nowTIme = Number(new Date().getTime())
    return claimRes.map((claimItem, claimIndex) => {
      if (!claimItem.result) return undefined
      const _currentToken = claimItem.result.flat()
      const _currentClaimedRes = claimedRes[claimIndex].result?.flat()
      const _ret: UnClaimListProps = {
        token: _currentToken[0].toString(),
        amount: _currentToken[1].toString(),
        claimAt: _currentToken[2].toString(),
        claimed: _currentClaimedRes ? _currentClaimedRes[0] : false,
        canClaim: _currentClaimedRes ? !_currentClaimedRes[0] : false
      }

      if (_ret.canClaim && nowTIme >= Number(_ret.claimAt) * 1000) {
        _ret.canClaim = true
      } else {
        _ret.canClaim = false
      }
      return _ret
    })
  }, [claimRes, claimedRes])

  const { data, loading } = useMemo((): { data: NFTIndexInfoProps | undefined; loading: boolean } => {
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
          _currencyToken = tokens[nft.underlyingTokens[index]] as WrappedTokenInfo
        }

        return {
          amount: _currencyToken ? toNumber(val.toString(), _currencyToken) : '0',
          amountRaw: _currencyToken ? undefined : val.toString(),
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
      assetsParameters
    }
    return {
      loading: nftIndexRes.loading,
      data: ret
    }
  }, [nftIndexRes, nftid, tokens])

  const nftInfo: NFTIndexInfoProps | undefined = useMemo(() => {
    if (!data) return undefined
    data.assetsParameters = data.assetsParameters.map(item => {
      let unClaimAmount = JSBI.BigInt(0)
      for (const claimItem of unClaimList) {
        if (!claimItem) continue
        if (claimItem.canClaim && item.currency === claimItem.token) {
          unClaimAmount = JSBI.add(JSBI.BigInt(claimItem.amount), unClaimAmount)
        }
      }
      return { ...item, unClaimAmount: unClaimAmount.toString() }
    })
    return data
  }, [data, unClaimList])

  return { loading, data: nftInfo, unClaimList, isExist: nftIndexRes.error }
}
