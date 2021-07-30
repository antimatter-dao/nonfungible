import { useTransactionAdder } from '../state/transactions/hooks'
import { useIndexNFTContract } from './useContract'
// import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'

export enum IndexBuyCallbackState {
  INVALID,
  LOADING,
  VALID
}

export function useIndexBuyCall(): {
  state: IndexBuyCallbackState
  callback: undefined | ((nftId: string, nftAmount: string) => Promise<string>)
  error: string | null
} {
  const addTransaction = useTransactionAdder()
  const contract = useIndexNFTContract()

  return {
    state: IndexBuyCallbackState.VALID,
    callback: async function onBuy(...args): Promise<string> {
      if (!contract) {
        throw new Error('Unexpected error. Contract error')
      }
      // return contract.estimateGas.mint(...args, {}).then(estimatedGasLimit => {
      return contract
        .mint(...args, { value: '1000000000000000000', gasLimit: '3500000' })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Buy`
          })
          return response.hash
        })
      // })
    },
    error: ''
  }
}
