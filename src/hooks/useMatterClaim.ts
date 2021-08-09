import { CurrencyAmount, JSBI } from '@uniswap/sdk'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useIndexNFTContract } from './useContract'

export function useCreatorFee() {
  const { account } = useWeb3React()
  const contract = useIndexNFTContract()
  const creatorTotalFeeRes = useSingleCallResult(contract, 'creatorTotalFee', [account ?? undefined])
  const creatorClaimedFeeRes = useSingleCallResult(contract, 'creatorClaimedFee', [account ?? undefined])

  return useMemo(() => {
    if (creatorTotalFeeRes.result && creatorClaimedFeeRes.result) {
      const raw = JSBI.subtract(
        JSBI.BigInt(creatorTotalFeeRes.result.toString()),
        JSBI.BigInt(creatorClaimedFeeRes.result.toString())
      )
      return CurrencyAmount.ether(raw)
    }
    return '0'
  }, [creatorTotalFeeRes, creatorClaimedFeeRes])
}
