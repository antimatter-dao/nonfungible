import { useTransactionAdder } from '../state/transactions/hooks'
import { useIndexNFTContract } from './useContract'
// import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { AssetsParameter } from '../components/Creation'
import { BigNumber } from 'bignumber.js'
import { useMemo } from 'react'
import { tryParseAmount } from 'state/swap/hooks'

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
      // console.log('nftId, nftAmount, amountOutMins', nftId, nftAmount, amountOutMins)

      // return contract.estimateGas.burn(nftId, nftAmount, amountOutMins, {}).then(estimatedGasLimit => {
      return contract
        .burn(nftId, nftAmount, amountOutMins, {
          gasLimit: '3500000'
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Sell`
          })
          return response.hash
        })
      // })
    },
    error: ''
  }
}

export function useAmountOutMins(
  nftAmount: string,
  assetsParameters: AssetsParameter[] | undefined,
  slippage: string | number
) {
  return useMemo(() => {
    if (!assetsParameters || !Number(nftAmount)) return undefined
    return assetsParameters.map(({ amount, currencyToken }) => {
      const _amount = new BigNumber(amount)
        .multipliedBy(nftAmount)
        .multipliedBy(slippage)
        .toString()

      return tryParseAmount(_amount, currencyToken)?.raw.toString() ?? ''
    })
  }, [assetsParameters, nftAmount, slippage])
}
