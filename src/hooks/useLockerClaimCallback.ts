import { useTransactionAdder } from '../state/transactions/hooks'
import { useLocker721NFTContract } from './useContract'
import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'

export enum LockerClaimCallbackState {
  INVALID,
  LOADING,
  VALID
}

export function useLockerClaim721Call(): {
  state: LockerClaimCallbackState
  callback: undefined | ((nftId: string) => Promise<string>)
  error: string | null
} {
  const addTransaction = useTransactionAdder()
  const contract = useLocker721NFTContract()

  return {
    state: LockerClaimCallbackState.VALID,
    callback: async function onClaim(nftId): Promise<string> {
      if (!contract) {
        throw new Error('Unexpected error. Contract error')
      }

      return contract.estimateGas.claim(nftId).then(estimatedGasLimit => {
        return contract
          .claim(nftId, {
            gasLimit: calculateGasMargin(estimatedGasLimit)
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Claim locker token`
            })
            return response.hash
          })
      })
    },
    error: ''
  }
}
