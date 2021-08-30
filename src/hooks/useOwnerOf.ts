import { useSingleCallResult } from '../state/multicall/hooks'
import { useLocker721NFTContract } from './useContract'

export function useOwnerOf(tokenid: string | undefined): string {
  const contract = useLocker721NFTContract()
  const res = useSingleCallResult(contract, 'ownerOf', [tokenid])
  return !res.error && res.result ? res.result[0] : ''
}
