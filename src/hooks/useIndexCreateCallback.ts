import { useTransactionAdder } from '../state/transactions/hooks'
import { useIndexNFTContract } from './useContract'
import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useMemo } from 'react'
import { TokenAmount } from '@uniswap/sdk'
import { TOKEN_FLUIDITY_LIMIT } from '../constants'
import { BigNumber } from 'bignumber.js'

export enum IndexCreateCallbackState {
  INVALID,
  LOADING,
  VALID
}

export function useIndexCreateCall(): {
  state: IndexCreateCallbackState
  callback:
    | undefined
    | ((name: string, metadata: string, underlyingTokens: string[], underlyingAmounts: string[]) => Promise<string>)
  error: string | null
} {
  const addTransaction = useTransactionAdder()
  const contract = useIndexNFTContract()

  return {
    state: IndexCreateCallbackState.VALID,
    callback: async function onCreate(...args): Promise<string> {
      if (!contract) {
        throw new Error('Unexpected error. Contract error')
      }
      return contract.estimateGas.createIndex(args, {}).then(estimatedGasLimit => {
        return contract
          .createIndex(args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
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

interface SpotCreateButtonProps {
  text: string
  disabled: boolean
}
export function useCheckSpotCreateButton(tokenFluiditys: (TokenAmount | null)[]): SpotCreateButtonProps {
  return useMemo(() => {
    const ret: SpotCreateButtonProps = {
      text: 'Confirm',
      disabled: false
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
  }, [tokenFluiditys])
}
