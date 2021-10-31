import { JSBI } from '@uniswap/sdk'
import { useMemo, useCallback, useState } from 'react'
import { useBlindBoxContract } from './useContract'
import { useSingleCallResult, useSingleContractMultipleData } from 'state/multicall/hooks'
import { useActiveWeb3React } from 'hooks'

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
  // const participatedRes = useSingleCallResult(contract, 'participated', [address ?? undefined])
  const balanceOfRes = useSingleCallResult(contract, 'balanceOf', [address ?? undefined])
  const remainingNFT = remainingNFTRes?.result
  const participated = balanceOfRes?.result
  const drawDeposit = drawDepositRes?.result?.toString()

  const drawCallback = useCallback(async () => {
    if (!contract) return null
    return contract.draw
  }, [contract])

  const result = useMemo(
    () => ({
      remainingNFT: remainingNFT ? parseInt(JSBI.BigInt(remainingNFT).toString()) : 0,
      participated: participated ? Number(participated[0].toString()) > 0 : false,
      drawDeposit,
      drawCallback: drawCallback
    }),
    [remainingNFT, participated, drawDeposit, drawCallback]
  )

  return result
}

export function useMyBlindBox() {
  const contract = useBlindBoxContract()
  const [loading, setLoading] = useState(true)
  const { account } = useActiveWeb3React()
  const ids = useMemo(() => {
    let id = 1
    const ret = []
    while (id <= 66) {
      ret.push([id])
      id++
    }
    return ret
  }, [])
  const ownerRes = useSingleContractMultipleData(contract, 'ownerOf', ids)
  const myIds = useMemo(() => {
    return ownerRes
      .map((item, index) => {
        if (!item.loading) setLoading(false)
        return item.result?.[0] === account ? index + 1 : undefined
      })
      .filter(item => item !== undefined)
  }, [account, ownerRes])

  return {
    loading,
    myIds
  }
}
