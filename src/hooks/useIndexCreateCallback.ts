import { useTransactionAdder } from '../state/transactions/hooks'
import { useIndexNFTContract } from './useContract'
import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'

export enum IndexCreateCallbackState {
  INVALID,
  LOADING,
  VALID
}

export function useIndexCreateCall(): {
  state: IndexCreateCallbackState
  callback: undefined | (() => Promise<string>)
  error: string | null
} {
  const addTransaction = useTransactionAdder()
  const contract = useIndexNFTContract()

  return {
    state: IndexCreateCallbackState.VALID,
    callback: async function onCreate(): Promise<string> {
      if (!contract) {
        throw new Error('Unexpected error. Contract error')
      }
      const args = ['']
      return contract.estimateGas.createIndex(...args, {}).then(estimatedGasLimit => {
        return contract
          .createIndex(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Create`
            })
            return response.hash
          })
      })
    },
    error: ''
  }
}
