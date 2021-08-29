import { Token, TokenAmount } from '@uniswap/sdk'
import { useMemo } from 'react'

import { useTokenContract } from '../hooks/useContract'
import { useMultipleContractSingleData, useSingleCallResult } from '../state/multicall/hooks'
import ERC20_INTERFACE from 'constants/abis/erc20'

export function useTokenAllowance(token?: Token, owner?: string, spender?: string): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false)

  const inputs = useMemo(() => [owner, spender], [owner, spender])
  const allowance = useSingleCallResult(contract, 'allowance', inputs).result

  return useMemo(() => (token && allowance ? new TokenAmount(token, allowance.toString()) : undefined), [
    token,
    allowance
  ])
}

export function useMultiTokenAllowance(
  tokens: (Token | undefined)[],
  owner?: string,
  spender?: string
): (TokenAmount | undefined)[] {
  const tokenAddresss = tokens.map(item => (item ? item.address : ''))

  const inputs = useMemo(() => [owner, spender], [owner, spender])

  const allowances = useMultipleContractSingleData(tokenAddresss, ERC20_INTERFACE, 'allowance', inputs)

  return useMemo(() => {
    return allowances.map((item, index) => {
      if (item.result && tokens[index] !== undefined) {
        return new TokenAmount(tokens[index] as Token, item.result.toString())
      }
      return undefined
    })
  }, [allowances, tokens])
}
