import { CurrencyAmount, ETHER, TokenAmount } from '@uniswap/sdk'
import { useCallback, useMemo } from 'react'
import { useHasMultiPendingApprovals, useTransactionAdder } from 'state/transactions/hooks'
import { useMultiTokenAllowance } from '../data/Allowances'
import { useActiveWeb3React } from './index'
import { useMultiTokenContract } from './useContract'
import ERC20_ABI from '../constants/abis/erc20.json'
import { calculateGasMargin } from 'utils'
import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useMultiApproveCallback(
  amountToApproves: (CurrencyAmount | undefined)[],
  spender: string
): {
  approvalStates: ApprovalState[]
  approveCalls: () => (() => Promise<any>)[]
} {
  const { account } = useActiveWeb3React()

  const tokens = amountToApproves.map(amountToApprove => {
    return amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined
  })

  const currentAllAllowances = useMultiTokenAllowance(tokens, account ?? '', spender)

  const tokenAddresss = tokens.map(item => item?.address)
  const pendingApprovals = useHasMultiPendingApprovals(tokenAddresss, spender)
  // check the current approval status
  const approvalStates: ApprovalState[] = useMemo(() => {
    return pendingApprovals.map((pendingApproval, index) => {
      const amountToApprove = amountToApproves[index]
      const currentAllowance = currentAllAllowances[index]
      if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
      if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED
      // we might not have enough data to know whether or not we need to approve
      if (!currentAllowance) return ApprovalState.UNKNOWN

      // amountToApprove will be defined if currentAllowance is
      return currentAllowance.lessThan(amountToApprove)
        ? pendingApproval
          ? ApprovalState.PENDING
          : ApprovalState.NOT_APPROVED
        : ApprovalState.APPROVED
    })
  }, [amountToApproves, currentAllAllowances, pendingApprovals, spender])

  const tokenContracts = useMultiTokenContract(tokenAddresss, ERC20_ABI, true)
  const addTransaction = useTransactionAdder()

  const approveCalls = useCallback((): (() => Promise<any>)[] => {
    return tokenContracts.map((tokenContract, index) => {
      return async () => {
        const approvalState = approvalStates[index]
        const token = tokens[index]
        const amountToApprove = amountToApproves[index]
        if (approvalState !== ApprovalState.NOT_APPROVED) {
          console.error('approve was called unnecessarily')
          return
        }
        if (!token) {
          console.error('no token')
          return
        }
        if (!tokenContract) {
          console.error('tokenContract is null')
          return
        }

        if (!amountToApprove) {
          console.error('missing amount to approve')
          return
        }

        if (!spender) {
          console.error('no spender')
          return
        }

        let useExact = false
        const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
          // general fallback for tokens who restrict approval amounts
          useExact = true
          return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString())
        })

        return tokenContract
          .approve(spender, useExact ? amountToApprove.raw.toString() : MaxUint256, {
            gasLimit: calculateGasMargin(estimatedGas)
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Approve ' + amountToApprove.currency.symbol,
              approval: { tokenAddress: token.address, spender: spender }
            })
          })
          .catch((error: Error) => {
            console.debug('Failed to approve token', error)
            throw error
          })
      }
    })
  }, [addTransaction, amountToApproves, approvalStates, spender, tokenContracts, tokens])

  return { approvalStates, approveCalls }
}
