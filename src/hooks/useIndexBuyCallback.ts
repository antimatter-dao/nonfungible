import { useTransactionAdder } from '../state/transactions/hooks'
import { useIndexNFTContract } from './useContract'
import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { JSBI } from '@uniswap/sdk'

export enum IndexBuyCallbackState {
  INVALID,
  LOADING,
  VALID
}

export function useIndexBuyCall(): {
  state: IndexBuyCallbackState
  callback: undefined | ((nftId: string, nftAmount: string, ethAmount: string) => Promise<string>)
  error: string | null
} {
  const addTransaction = useTransactionAdder()
  const contract = useIndexNFTContract()

  return {
    state: IndexBuyCallbackState.VALID,
    callback: async function onBuy(nftId, nftAmount, ethAmount): Promise<string> {
      if (!contract) {
        throw new Error('Unexpected error. Contract error')
      }

      const valueLimit = JSBI.multiply(JSBI.BigInt(ethAmount), JSBI.BigInt(nftAmount)).toString()

      return contract.estimateGas.mint(nftId, nftAmount, { value: valueLimit }).then(estimatedGasLimit => {
        return contract
          .mint(nftId, nftAmount, {
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
