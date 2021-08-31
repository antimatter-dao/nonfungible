import React, { useCallback } from 'react'
import styled from 'styled-components'
import useMediaWidth from 'hooks/useMediaWidth'

const LogosContainer = styled.div`
  height: 380px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  height: 75%;
  top: 20px;
  left: -10px
  `}
`

const LogoWrapper = styled.div<{ size: number; top: number; left: number }>`
  position: absolute;
  z-index: 3;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(169.06deg, #ffffff 8.1%, #f5f5f5 64.51%, #000000 176.95%),
    linear-gradient(135.43deg, #000000 -7.49%, #000000 60.86%, #02ff49 180.85%);
  svg,
  img {
    height: 60%;
    width: 60%;
  }
  ${({ top, left, theme }) => theme.mediaWidth.upToSmall`
    top: ${(top / 3.5).toFixed(1)}%;
    left: ${(left / 2.5).toFixed(1)}%;
  `}
  ${({ size, theme }) => theme.mediaWidth.upToSmall`
  width: ${((size * 2) / 3 + 10).toFixed(1)}px;
  height: ${((size * 2) / 3 + 10).toFixed(1)}px;
  `}
`

export default function CurrencyLogosOverlay({ icons = [] }: { icons: React.ReactNode[] }) {
  const match = useMediaWidth('upToSmall')
  const constructIcons = useCallback(
    (icons: React.ReactNode[]) => {
      switch (icons.length) {
        case 0:
          return null
        case 1:
          return (
            <LogoWrapper size={64} top={148} left={108}>
              {icons[0]}
            </LogoWrapper>
          )
        case 2:
          return (
            <>
              <LogoWrapper size={50} top={121} left={60}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={62} top={170} left={157}>
                {icons[1]}
              </LogoWrapper>
            </>
          )
        case 3:
          return (
            <>
              <LogoWrapper size={47} top={100} left={187}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={43} top={126} left={49}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={56} top={183} left={124}>
                {icons[2]}
              </LogoWrapper>
            </>
          )
        case 4:
          return (
            <>
              <LogoWrapper size={48} top={111} left={49}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={36} top={106} left={match ? 150 : 168}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={40} top={188} left={98}>
                {icons[2]}
              </LogoWrapper>
              <LogoWrapper size={60} top={match ? 200 : 226} left={match ? 175 : 175}>
                {icons[3]}
              </LogoWrapper>
            </>
          )
        case 5:
          return (
            <>
              <LogoWrapper size={48} top={104} left={40}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={40} top={97} left={200}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={36} top={144} left={121}>
                {icons[2]}
              </LogoWrapper>
              <LogoWrapper size={32} top={211} left={83}>
                {icons[3]}
              </LogoWrapper>
              <LogoWrapper size={56} top={234} left={168}>
                {icons[4]}
              </LogoWrapper>
            </>
          )
        case 6:
          return (
            <>
              <LogoWrapper size={40} top={104} left={40}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={40} top={97} left={200}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={36} top={match ? 120 : 134} left={match ? 100 : 119}>
                {icons[2]}
              </LogoWrapper>
              <LogoWrapper size={32} top={190} left={58}>
                {icons[3]}
              </LogoWrapper>
              <LogoWrapper size={44} top={199} left={match ? 130 : 158}>
                {icons[4]}
              </LogoWrapper>
              <LogoWrapper size={40} top={match ? 250 : 270} left={match ? 180 : 195}>
                {icons[5]}
              </LogoWrapper>
            </>
          )
        case 7:
          return (
            <>
              <LogoWrapper size={40} top={104} left={40}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={40} top={97} left={200}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={36} top={match ? 100 : 134} left={119}>
                {icons[2]}
              </LogoWrapper>
              <LogoWrapper size={32} top={190} left={58}>
                {icons[3]}
              </LogoWrapper>
              <LogoWrapper size={44} top={199} left={158}>
                {icons[4]}
              </LogoWrapper>
              <LogoWrapper size={28} top={232} left={115}>
                {icons[5]}
              </LogoWrapper>
              <LogoWrapper size={40} top={270} left={195}>
                {icons[6]}
              </LogoWrapper>
            </>
          )
        default:
          return (
            <>
              <LogoWrapper size={40} top={104} left={40}>
                {icons[0]}
              </LogoWrapper>
              <LogoWrapper size={40} top={97} left={200}>
                {icons[1]}
              </LogoWrapper>
              <LogoWrapper size={36} top={134} left={119}>
                {icons[2]}
              </LogoWrapper>
              <LogoWrapper size={32} top={190} left={58}>
                {icons[3]}
              </LogoWrapper>
              <LogoWrapper size={28} top={match ? 200 : 267} left={212}>
                {icons[4]}
              </LogoWrapper>
              <LogoWrapper size={44} top={194} left={147}>
                {icons[5]}
              </LogoWrapper>
              <LogoWrapper size={28} top={220} left={93}>
                {icons[6]}
              </LogoWrapper>
              <LogoWrapper size={40} top={270} left={195}>
                {icons[7]}
              </LogoWrapper>
            </>
          )
      }
    },
    [match]
  )

  return <LogosContainer>{constructIcons(icons)}</LogosContainer>
}
