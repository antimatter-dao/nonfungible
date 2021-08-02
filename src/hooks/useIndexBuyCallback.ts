import { useTransactionAdder } from '../state/transactions/hooks'
import { useIndexNFTContract } from './useContract'
import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'
import { INDEX_NFT_BUY_FEE } from '../constants'
import { useMemo } from 'react'
import { CurrencyAmount, JSBI } from '@uniswap/sdk'
import { NFTETHPriceProp } from 'data/Reserves'

export enum IndexBuyCallbackState {
  INVALID,
  LOADING,
  VALID
}

export function useCalcBuyFee(ethAmount: string, nftAmount: string, slippage: string | number): string {
  return useMemo(() => {
    return new BigNumber(ethAmount)
      .multipliedBy(nftAmount)
      .multipliedBy(1 + Number(slippage))
      .plus(INDEX_NFT_BUY_FEE)
      .toString()
  }, [ethAmount, nftAmount, slippage])
}

export function useAmountInMins(
  eths: NFTETHPriceProp['eths'],
  nftAmount: string,
  slippage: string | number
): string[] | undefined {
  return useMemo(() => {
    if (!eths || !slippage || !nftAmount) return undefined
    return eths.map(item => {
      return new BigNumber(CurrencyAmount.ether(JSBI.BigInt(item[1] ?? '0')).raw.toString())
        .multipliedBy(1 + Number(slippage))
        .multipliedBy(nftAmount)
        .toString()
    })
  }, [slippage, eths, nftAmount])
}

export function useIndexBuyCall(): {
  state: IndexBuyCallbackState
  callback:
    | undefined
    | ((nftId: string, nftAmount: string, amountInMaxs: string[], valueLimit: string) => Promise<string>)
  error: string | null
} {
  const addTransaction = useTransactionAdder()
  const contract = useIndexNFTContract()

  return {
    state: IndexBuyCallbackState.VALID,
    callback: async function onBuy(nftId, nftAmount, amountInMaxs, valueLimit): Promise<string> {
      if (!contract) {
        throw new Error('Unexpected error. Contract error')
      }

      return contract.estimateGas
        .mint(nftId, nftAmount, amountInMaxs, { value: valueLimit })
        .then(estimatedGasLimit => {
          return contract
            .mint(nftId, nftAmount, amountInMaxs, {
              value: valueLimit,
              gasLimit: calculateGasMargin(estimatedGasLimit)
            })
            .then((response: TransactionResponse) => {
              addTransaction(response, {
                summary: `Buy`
              })
              return response.hash
            })
        })
    },
    error: ''
  }
}
