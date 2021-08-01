import { TokenAmount, Pair, Currency, WETH, CurrencyAmount, JSBI } from '@uniswap/sdk'
import { useMemo } from 'react'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { Interface } from '@ethersproject/abi'
import { useActiveWeb3React } from '../hooks'

import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { AssetsParameter } from '../components/Creation'
import { tryParseAmount } from '../state/swap/hooks'
import { BigNumber } from 'bignumber.js'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID
}

export enum PriceState {
  LOADING,
  VALID,
  INVALID = 2
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React()

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId)
      ]),
    [chainId, currencies]
  )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
      }),
    [tokens]
  )
  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]

      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()))
      ]
    })
  }, [results, tokens])
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0]
}

export function useNFTETHPrice(assets: AssetsParameter[]): [PriceState, string | null] {
  const { chainId } = useActiveWeb3React()

  const pairAddresses = useMemo(
    () =>
      assets.map(({ currencyToken }) => {
        return currencyToken && chainId ? Pair.getAddress(currencyToken, WETH[chainId]) : undefined
      }),
    [assets, chainId]
  )
  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return useMemo(() => {
    const eths: [PriceState, string | null][] = results.map((result, i) => {
      const { result: reserves, loading } = result
      const token = assets[i]
      if (loading) return [PriceState.LOADING, null]
      if (!chainId || !token.currencyToken || !reserves) return [PriceState.INVALID, null]
      const { reserve0, reserve1 } = reserves
      console.log(
        'reserve0',
        new Pair(
          new TokenAmount(WETH[chainId], reserve0.toString()),
          new TokenAmount(token.currencyToken, reserve1.toString())
        )
          .priceOf(WETH[chainId])
          .toSignificant()
          .toString()
      )
      const ethPrice: string = new Pair(
        new TokenAmount(WETH[chainId], reserve0.toString()),
        new TokenAmount(token.currencyToken, reserve1.toString())
      )
        .priceOf(WETH[chainId])
        .toSignificant()
        .toString()

      const tokenAmount: CurrencyAmount | undefined = tryParseAmount(
        new BigNumber(ethPrice).multipliedBy(token.amount).toString(),
        WETH[chainId]
      )
      if (!tokenAmount) return [PriceState.INVALID, null]
      return [PriceState.VALID, tokenAmount.raw.toString()]
    })

    return eths.length !== 0
      ? eths.reduce(([preState, preETH], [curState, curETH]) => {
          return preState === PriceState.VALID && curState === PriceState.VALID && preETH && curETH
            ? [PriceState.VALID, JSBI.add(JSBI.BigInt(preETH), JSBI.BigInt(curETH)).toString()]
            : [PriceState.INVALID, '0']
        })
      : [PriceState.INVALID, '0']
  }, [results, chainId, assets])
}
