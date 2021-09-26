import { JSBI } from '@uniswap/sdk'
import { useMemo, useCallback } from 'react'
import { useBlindBoxContract } from './useContract'
import { useSingleCallResult } from 'state/multicall/hooks'

export function useBlindBox(
  address: string | null | undefined
): {
  remainingNFT: any
  participated: boolean
  drawCallback: null | (() => Promise<string | null>)
} {
  const contract = useBlindBoxContract()
  const remainingNFTRes = useSingleCallResult(contract, 'getGiftLength')
  const participatedRes = useSingleCallResult(contract, 'participated', [address ?? undefined])
  const remainingNFT = remainingNFTRes?.result
  const participated = participatedRes?.result
  // useEffect(() => {
  //   ;(async () => {
  //     if (!contract) return
  //     try {
  //       const remainingNFTres = contract.getGiftLength()
  //       console.log(remainingNFTres)
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   })()
  // }, [contract])

  const drawCallback = useCallback(
    async function onSwap(): Promise<string | null> {
      if (!contract) return null
      return contract
        .draw(null, {
          from: address
        })
        .then((response: any) => {
          console.log(777, response)
        })
        .catch((error: any) => {
          if (error?.code === 4001) {
            throw new Error('Transaction rejected.')
          } else {
            throw new Error(`Draw failed: ${error.message}`)
          }
        })
    },
    [address, contract]
  )
  console.log(999, remainingNFT, participated)

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
