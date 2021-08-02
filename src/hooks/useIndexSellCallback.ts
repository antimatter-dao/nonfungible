import { useTransactionAdder } from '../state/transactions/hooks'
import { useIndexNFTContract } from './useContract'
import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { BigNumber } from 'bignumber.js'
import { useMemo } from 'react'
import { CurrencyAmount, JSBI } from '@uniswap/sdk'
import { NFTETHPriceProp } from 'data/Reserves'

export enum IndexBuyCallbackState {
  INVALID,
  LOADING,
  VALID
}

export function useIndexSellCall(): {
  state: IndexBuyCallbackState
  callback: undefined | ((nftId: string, nftAmount: string, amountOutMins: string[]) => Promise<string>)
  error: string | null
} {
  const addTransaction = useTransactionAdder()
  const contract = useIndexNFTContract()

  return {
    state: IndexBuyCallbackState.VALID,
    callback: async function onSell(nftId, nftAmount, amountOutMins): Promise<string> {
      if (!contract) {
        throw new Error('Unexpected error. Contract error')
      }
      console.log('nftId, nftAmount, amountOutMins', nftId, nftAmount, amountOutMins)

      return contract.estimateGas.burn(nftId, nftAmount, amountOutMins, {}).then(estimatedGasLimit => {
        return contract
          .burn(nftId, nftAmount, amountOutMins, {
            gasLimit: calculateGasMargin(estimatedGasLimit)
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Sell`
            })
            return response.hash
          })
      })
    },
    error: ''
  }
}

export function useAmountOutMins(eths: NFTETHPriceProp['eths'], nftAmount: string, slippage: string | number) {
  return useMemo(() => {
    if (!eths || !slippage || !nftAmount) return undefined
    return eths.map(item => {
      return new BigNumber(CurrencyAmount.ether(JSBI.BigInt(item[1] ?? '0')).raw.toString())
        .multipliedBy(1 - Number(slippage))
        .multipliedBy(nftAmount)
        .toString()
    })
  }, [slippage, eths, nftAmount])
}
