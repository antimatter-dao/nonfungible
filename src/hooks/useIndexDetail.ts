import { AssetsParameter } from 'components/Creation'
import { CardColor } from 'components/NFTCard'
import { useEffect, useMemo, useState } from 'react'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useAllTokens, useCurrency, useWrappedTokenInfos } from './Tokens'
import { useIndexNFTContract } from './useContract'
import { CurrencyAmount, JSBI, TokenAmount } from '@uniswap/sdk'
import { useWeb3React } from '@web3-react/core'
import { getAccountInfo, getNFTTransferRecords } from 'utils/option/httpFetch'
import { CHAIN_ETH_NAME, TOKEN_FLUIDITY_LIMIT } from '../constants'
import { BigNumber } from 'bignumber.js'
import { useActiveWeb3React } from 'hooks'

export interface NFTIndexInfoProps {
  name: string
  description: string
  color: CardColor
  assetsParameters: AssetsParameter[]
  creator: string
  creatorId: string
}

export interface BuyButtonProps {
  text: string
  disabled: boolean
}

export interface NFTCreatorInfo {
  username: string
  bio: string
}
export function useNFTCreatorInfo(address: string | undefined): NFTCreatorInfo | undefined {
  const [info, setInfo] = useState<any>()
  useEffect(() => {
    if (!address) {
      setInfo(undefined)
      return
    }
    getAccountInfo(address).then(res => {
      if (!res) {
        setInfo(undefined)
        return
      }
      const ret: NFTCreatorInfo = {
        username: res.username ?? '',
        bio: res.description ?? ''
      }
      setInfo(ret)
    })
  }, [address])
  return info
}

export function toNumber(weiValue: string, token: WrappedTokenInfo | undefined) {
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
          _currencyToken = tokens[nft.underlyingTokens[index]] as WrappedTokenInfo
          // if (!_currencyToken) _currencyToken = tokens[Object.keys(tokens)[0]] as WrappedTokenInfo
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
}

export function useAssetsTokens(assetsParameters: AssetsParameter[] | undefined): AssetsParameter[] {
  const address = assetsParameters?.map(({ currency }) => currency)
  const allTokens = useAllTokens()
  const tokens = useWrappedTokenInfos(address ?? [])

  return useMemo(() => {
    if (!assetsParameters) return []
    if (!tokens) return assetsParameters
    return assetsParameters?.map((item, index) => {
      if (item.currencyToken) {
        return { ...item }
      }
      if (item.currency && allTokens[item.currency]) {
        item.currencyToken = allTokens[item.currency] as WrappedTokenInfo
        return { ...item }
      }
      if (tokens[index]) item.currencyToken = tokens[index]
      if (item.currencyToken && item.amountRaw)
        item.amount = new TokenAmount(item.currencyToken, JSBI.BigInt(item.amountRaw)).toSignificant()
      return item
    })
  }, [allTokens, assetsParameters, tokens])
}

export function useNFTBalance(nftid: string | undefined) {
  const { account } = useWeb3React()
  const contract = useIndexNFTContract()
  const balanceRes = useSingleCallResult(contract, 'balanceOf', [account ?? undefined, nftid])
  return useMemo(() => {
    return {
      loading: balanceRes.loading,
      data: balanceRes.result
    }
  }, [balanceRes])
}

export function useCheckBuyButton(
  ethAmount: CurrencyAmount | undefined,
  ETHbalance: CurrencyAmount | undefined,
  number: string | undefined,
  tokenFluiditys: (TokenAmount | null)[]
): BuyButtonProps {
  const { chainId } = useActiveWeb3React()
  return useMemo(() => {
    const ret: BuyButtonProps = {
      text: 'Confirm',
      disabled: false
    }
    if (!number || !ethAmount || !ETHbalance) {
      ret.disabled = true
      return ret
    }
    if (!tokenFluiditys) {
      ret.disabled = true
      ret.text = 'Insufficient liquidity'
      return ret
    }
    const Insufficients = tokenFluiditys.filter((item: TokenAmount | null) => {
      return !item || new BigNumber(item.toSignificant()).isLessThan(TOKEN_FLUIDITY_LIMIT)
    })
    if (Insufficients.length) {
      ret.disabled = true
      ret.text = 'Insufficient liquidity'
      return ret
    }
    if (ETHbalance.lessThan(ethAmount.multiply(JSBI.BigInt(number)))) {
      ret.disabled = true
      ret.text = `Insufficient ${CHAIN_ETH_NAME[chainId ?? 1]} balance`
      return ret
    }
    return ret
  }, [number, ethAmount, ETHbalance, tokenFluiditys, chainId])
}

export function useCheckSellButton(number: string | undefined, tokenFluiditys: (TokenAmount | null)[]): BuyButtonProps {
  return useMemo(() => {
    const ret: BuyButtonProps = {
      text: 'Confirm',
      disabled: false
    }
    if (!number) {
      ret.disabled = true
      return ret
    }
    if (!tokenFluiditys) {
      ret.disabled = true
      ret.text = 'Insufficient liquidity'
      return ret
    }
    const Insufficients = tokenFluiditys.filter((item: TokenAmount | null) => {
      return !item || new BigNumber(item.toSignificant()).isLessThan(TOKEN_FLUIDITY_LIMIT)
    })
    if (Insufficients.length) {
      ret.disabled = true
      ret.text = 'Insufficient liquidity'
      return ret
    }
    return ret
  }, [number, tokenFluiditys])
}

export function useIsApprovedForAll(account: string | undefined, spender: string): boolean {
  const contract = useIndexNFTContract()
  const apprivedRes = useSingleCallResult(account ? contract : undefined, 'isApprovedForAll', [
    account ?? undefined,
    spender ?? undefined
  ])
  return useMemo(() => {
    if (!account) return false
    return apprivedRes.result ? apprivedRes.result[0] : false
  }, [account, apprivedRes.result])
}

export interface NFTTransactionRecordsProps {
  id: string
  indexId: string
  nftAmount: string
  sender: string
  totalSpend: string
  type: string
}
export function useNFTTransactionRecords(nftId: string | undefined): NFTTransactionRecordsProps[] | undefined {
  const [info, setInfo] = useState<any>()
  const ETHCurrency = useCurrency('ETH')
  useEffect(() => {
    if (!nftId) {
      setInfo(undefined)
      return
    }
    getNFTTransferRecords(nftId).then(res => {
      if (res === undefined) {
        setInfo(undefined)
        return
      }
      const ret: NFTTransactionRecordsProps[] = res.records.map(
        (item: any): NFTTransactionRecordsProps => {
          return {
            id: item.id ?? '',
            indexId: item.indexId ?? '',
            nftAmount: item.nftAmount ?? '',
            sender: item.sender ?? '',
            totalSpend: item.totalSpend
              ? toNumber(item.totalSpend, (ETHCurrency as WrappedTokenInfo) ?? undefined)
              : '',
            type: item.type ? (item.type === 1 ? 'buy' : 'sell') : ''
          }
        }
      )
      setInfo(ret)
    })
  }, [ETHCurrency, nftId])
  return info
}
