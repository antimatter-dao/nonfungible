import { JSBI } from '@uniswap/sdk'
import { useMemo, useCallback } from 'react'
import { useBlindBoxContract } from './useContract'
import { useSingleCallResult } from 'state/multicall/hooks'

export function useBlindBox(
  address: string | null | undefined
): {
  remainingNFT: any
  participated: boolean
  drawDeposit: string | undefined
  drawCallback: null | ((...args: any) => Promise<any>)
} {
  const contract = useBlindBoxContract()
  const remainingNFTRes = useSingleCallResult(contract, 'getGiftLength')
  const drawDepositRes = useSingleCallResult(contract, 'drawDeposit')
  const participatedRes = useSingleCallResult(contract, 'participated', [address ?? undefined])
  const remainingNFT = remainingNFTRes?.result
  const participated = participatedRes?.result
  const drawDeposit = drawDepositRes?.result?.toString()

  const drawCallback = useCallback(async () => {
    if (!contract) return null
    return contract.draw
  }, [contract])

  const result = useMemo(
    () => ({
      remainingNFT: remainingNFT ? parseInt(JSBI.BigInt(remainingNFT).toString()) : 0,
      participated: participated?.[0] ?? false,
      drawDeposit,
      drawCallback: drawCallback
    }),
    [remainingNFT, participated, drawDeposit, drawCallback]
  )

  return result
}
