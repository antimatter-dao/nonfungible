import { TransactionResponse } from '@ethersproject/providers'
import { useCallback, useMemo } from 'react'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils'
import { useActiveWeb3React } from './index'
import { useIndexNFTContract } from './useContract'
import { useIsApprovedForAll } from './useIndexDetail'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useNFTApproveCallback(spender: string): [ApprovalState, () => Promise<void>] {
  const { account } = useActiveWeb3React()
  const contract = useIndexNFTContract()
  const isApproved = useIsApprovedForAll(account ?? '', spender)
  const pendingApproval = useHasPendingApproval(account ?? '', spender)
  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!spender) return ApprovalState.UNKNOWN

    return isApproved ? ApprovalState.APPROVED : pendingApproval ? ApprovalState.PENDING : ApprovalState.NOT_APPROVED
  }, [isApproved, pendingApproval, spender])

  const addTransaction = useTransactionAdder()

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }
    if (!contract) {
      return
    }

    // let useExact = false
    const estimatedGas = await contract.estimateGas.setApprovalForAll(spender, true).catch(() => {
      // general fallback for tokens who restrict approval amounts
      // useExact = true
      return contract.estimateGas.setApprovalForAll(spender, true)
    })

    return contract
      .setApprovalForAll(spender, true, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve nft',
          approval: { tokenAddress: account ?? '', spender: spender }
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, spender, addTransaction, contract, account])

  return [approvalState, approve]
}
