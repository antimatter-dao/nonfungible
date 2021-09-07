import { Currency, ETHER, Token } from '@uniswap/sdk'
import { useActiveWeb3React } from 'hooks'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'

export const getTokenLogoURL = (address: string, symbol = '', chainId = 1) => {
  if (chainId === 250 && symbol) {
    return `https://assets.spookyswap.finance/tokens/${symbol}.png`
  }
  if (chainId === 56) {
    return `https://pancakeswap.finance/images/tokens/${address}.png`
  }
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
}

export const getAntimatterTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  /* box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075); */
  background-color: transparent;
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  const { chainId } = useActiveWeb3React()

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [
          ...uriLocations,
          getTokenLogoURL(currency.address, currency.symbol, chainId),
          getTokenLogoURL(currency.address)
        ]
      }
      return [getTokenLogoURL(currency.address, currency.symbol, chainId), getTokenLogoURL(currency.address)]
    }
    return []
  }, [chainId, currency, uriLocations])

  if (currency === ETHER) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
