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

export interface NFTETHPriceProp {
  ethAmount: [PriceState, string | null]
  eths: [PriceState, string | null, CurrencyAmount | null, TokenAmount | null][]
}

export function useNFTETHPrice(assets: AssetsParameter[]): NFTETHPriceProp {
  const { chainId } = useActiveWeb3React()

  const pairAddresses = useMemo(
    () =>
      assets.map(({ currencyToken }) => {
        if (!chainId || !currencyToken) return undefined
        if (currencyToken && currencyToken.equals(WETH[chainId])) return undefined
        return Pair.getAddress(currencyToken, WETH[chainId])
      }),
    [assets, chainId]
  )
  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return useMemo(() => {
    if (!chainId) {
      return {
        ethAmount: [PriceState.INVALID, '0'],
        eths: []
      }
    }

    const eths: [PriceState, string | null, CurrencyAmount | null, TokenAmount | null][] = results.map((result, i) => {
      if (assets[i].currencyToken?.equals(WETH[chainId])) {
        const _ethAmount = new TokenAmount(WETH[chainId], '1000000000000000000')
        return [
          PriceState.VALID,
          _ethAmount.raw.toString(),
          _ethAmount,
          new TokenAmount(WETH[chainId], '10000000000000000000000')
        ]
      }
      const { result: reserves, loading } = result
      const token = assets[i]
      if (loading) return [PriceState.LOADING, null, null, null]
      if (!chainId || !token.currencyToken || !reserves) return [PriceState.INVALID, null, null, null]
      const { reserve0, reserve1 } = reserves
      // console.log(
      //   'reserve0',
      //   token.currencyToken.symbol,
      //   // new TokenAmount(WETH[chainId], reserve0.toString()).toSignificant()
      //   new TokenAmount(token.currencyToken, reserve0.toString()).toSignificant(),
      //   new TokenAmount(WETH[chainId], reserve0.toString()).toSignificant()
      // )
      // console.log(
      //   'reserve1',
      //   token.currencyToken.symbol,
      //   new TokenAmount(WETH[chainId], reserve1.toString()).toSignificant()
      // )
      // console.log(
      //   'reserve0',
      //   new Pair(
      //     new TokenAmount(WETH[chainId], reserve0.toString()),
      //     new TokenAmount(token.currencyToken, reserve1.toString())
      //   )
      //     .priceOf(WETH[chainId])
      //     .toSignificant()
      //     .toString()
      // )
      const tokenA = token.currencyToken
      const tokenB = WETH[chainId]
      const ethPrice: string = new Pair(
        new TokenAmount(tokenA, reserve0.toString()),
        new TokenAmount(tokenB, reserve1.toString())
      )
        .priceOf(tokenA.sortsBefore(tokenB) ? tokenA : tokenB)
        .toSignificant()
        .toString()
      // console.log('ethPrice', token.currencyToken.symbol, ethPrice)

      const ethAmount: CurrencyAmount | undefined = tryParseAmount(
        new BigNumber(ethPrice).multipliedBy(token.amount).toString(),
        WETH[chainId]
      )
      if (!ethAmount) return [PriceState.INVALID, null, null, new TokenAmount(WETH[chainId], reserve1.toString())]
      return [
        PriceState.VALID,
        ethAmount.raw.toString(),
        ethAmount,
        new TokenAmount(WETH[chainId], reserve1.toString())
      ]
    })

    const ret: [PriceState, string | null] =
      eths.length !== 0
        ? eths
            .map((item): [PriceState, string | null] => [item[0], item[1]])
            .reduce(([preState, preETH], [curState, curETH]): [PriceState, string | null] => {
              return preState === PriceState.VALID || curState === PriceState.VALID
                ? [PriceState.VALID, JSBI.add(JSBI.BigInt(preETH ?? 0), JSBI.BigInt(curETH ?? 0)).toString()]
                : [PriceState.INVALID, '0']
            })
        : [PriceState.INVALID, '0']

    return {
      ethAmount: ret,
      eths: eths
    }
  }, [results, chainId, assets])
}
