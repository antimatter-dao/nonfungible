import { JSBI } from '@uniswap/sdk'
import { useMemo, useCallback } from 'react'
import { useBlindBoxContract } from './useContract'
import { useSingleCallResult } from 'state/multicall/hooks'

export function useBlindBox(
  address: string | null | undefined
): {
  remainingNFT: any
  participated: boolean
  drawCallback: null | ((...args: any) => Promise<any>)
} {
  const contract = useBlindBoxContract()
  const remainingNFTRes = useSingleCallResult(contract, 'getGiftLength')
  const participatedRes = useSingleCallResult(contract, 'participated', [address ?? undefined])
  const remainingNFT = remainingNFTRes?.result
  const participated = participatedRes?.result

  const drawCallback = useCallback(
    async function onSwap(): Promise<string | null> {
      if (!contract) return null
      return contract.draw
    },
    [contract]
  )

  const result = useMemo(
    () => ({
      remainingNFT: remainingNFT ? parseInt(JSBI.BigInt(remainingNFT).toString()) : 0,
      participated: participated?.[0] ?? false,
      drawCallback: drawCallback
    }),
    [remainingNFT, participated, drawCallback]
  )
  console.log(result)

  return result
}
