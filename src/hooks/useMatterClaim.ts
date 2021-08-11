import { CurrencyAmount, JSBI } from '@uniswap/sdk'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { calculateGasMargin } from 'utils'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useIndexNFTContract } from './useContract'
import { TransactionResponse } from '@ethersproject/providers'

export enum ClaimCallbackState {
  INVALID,
  LOADING,
  VALID
}

export function useCreatorFee() {
  const { account } = useWeb3React()
  const contract = useIndexNFTContract()
  const creatorTotalFeeRes = useSingleCallResult(contract, 'creatorTotalFee', [account ?? undefined])
  const creatorClaimedFeeRes = useSingleCallResult(contract, 'creatorClaimedFee', [account ?? undefined])

  return useMemo(() => {
    if (creatorTotalFeeRes.result && creatorClaimedFeeRes.result) {
      const raw = JSBI.subtract(
        JSBI.BigInt(creatorTotalFeeRes.result[0].toString()),
        JSBI.BigInt(creatorClaimedFeeRes.result[0].toString())
      )
      return CurrencyAmount.ether(raw).toSignificant(4)
    }
    return '0'
  }, [creatorTotalFeeRes, creatorClaimedFeeRes])
}

export function useClaimMATTERCall(): {
  state: ClaimCallbackState
  callback: undefined | (() => Promise<string>)
  error: string | null
} {
  const addTransaction = useTransactionAdder()
  const contract = useIndexNFTContract()

  return {
    state: ClaimCallbackState.VALID,
    callback: async function creatorClaim(): Promise<string> {
      if (!contract) {
        throw new Error('Unexpected error. Contract error')
      }

      return contract.estimateGas.creatorClaim().then(estimatedGasLimit => {
        return contract
          .creatorClaim({
            gasLimit: calculateGasMargin(estimatedGasLimit)
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Claim MATTER`
            })
            return response.hash
          })
      })
    },
    error: ''
  }
}
