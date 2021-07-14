import React, { useCallback } from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { TYPE } from 'theme'
import { AutoColumn } from 'components/Column'

export enum CardColor {
  RED = 'pastelRed',
  PURPLE = 'pastelPurple',
  YELLOW = 'pastelYellow',
  GREEN = 'pastelGreen',
  BLUE = 'pastelBlue'
}

const CardWrapper = styled.div<{ color: CardColor }>`
  background: #ffffff;
  border-radius: 30px;
  height: 380px;
  width: 280px;
  position: relative;
  overflow: hidden;
  padding: 20px;
  :before {
    content: '';
    position: absolute;
    width: 316px;
    height: 184px;
    left: 40%;
    top: -100px;
    background: ${({ theme, color }) => theme[color]};
    filter: blur(100px);
    border-radius: 160px;
    transition: 0.5s;
    z-index: 1;
  }
  :after {
    content: '';
    position: absolute;
    width: 316px;
    height: 184px;
    left: 40%px;
    top: -100px;
    background: ${({ theme, color }) => theme[color]};
    filter: blur(100px);
    border-radius: 120px;
    transition: 0.5s;
    z-index: 1;
  }
  :hover {
    :before {
      width: 468px;
      height: 272px;
    }
    :after {
      width: 468px;
      height: 272px;
    }
  }
`

const LogosContainer = styled.div`
  height: 380px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`
const LogoWrapper = styled.div<{ size: number; top: number; left: number }>`
  position: absolute;
  z-index: 2;
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
  svg {
    height: ${({ size }) => size / 2}px;
    width: ${({ size }) => size / 2}px;
  }
`

const OutlineCard = styled.div`
  border: 1px solid ${({ theme }) => theme.text2};
  height: 100%;
  z-index: 2;
  border-radius: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  & * {
    z-index: 2;
  }
`

const Capsule = styled.div<{ color: CardColor }>`
  padding: 6px 10px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  width: max-content;
  display: flex;
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 0.2;
    background-color: ${({ theme, color }) => theme[color]};
  }
`

function NFTCardBase({ children, color, address }: { children: React.ReactNode; color: CardColor; address: string }) {
  return (
    <CardWrapper color={color}>
      <CurverText text={address} />
      <CurverText text={address} inverted />
      <OutlineCard>{children}</OutlineCard>
    </CardWrapper>
  )
}

export default function NFTCard({
  icons,
  indexId,
  creator,
  name,
  color,
  address
}: {
  icons: React.ReactNode[]
  indexId: string
  creator: string
  name: string
  color: CardColor
  address: string
}) {
  return (
    <NFTCardBase color={color} address={address}>
      <CurrencyLogos icons={icons} />
      <TYPE.black fontWeight={700} fontSize={28} color="#000000">
        {name}
      </TYPE.black>
      <AutoColumn gap="4px">
        <Capsule color={color}>
          <TYPE.smallGray>Index ID:&nbsp;</TYPE.smallGray>
          <TYPE.small color="#000000"> {indexId}</TYPE.small>
        </Capsule>
        <Capsule color={color}>
          <TYPE.smallGray>Creator:&nbsp;</TYPE.smallGray>
          <TYPE.small color="#000000"> {creator}</TYPE.small>
        </Capsule>
      </AutoColumn>
    </NFTCardBase>
  )
}

export function NFTGovernanceCard({
  time,
  title,
  color,
  address
}: {
  time: string
  title: string
  color: CardColor
  address: string
}) {
  const theme = useTheme()
  return (
    <NFTCardBase color={color} address={address}>
      <AutoColumn gap="4px">
        <TYPE.black fontWeight={700} fontSize={24} color="#000000">
          {title}
        </TYPE.black>

        <Capsule color={color}>
          <TYPE.small color={theme[color]}> {time}</TYPE.small>
        </Capsule>
      </AutoColumn>
    </NFTCardBase>
  )
}

function CurverText({ text, inverted }: { text: string; inverted?: boolean }) {
  const theme = useTheme()
  return (
    <svg
      width="151"
      height="70"
      viewBox="0 0 151 70"
      style={
        inverted
          ? { position: 'absolute', left: 0, bottom: 4, transform: 'rotate(180deg)', zIndex: 2 }
          : { position: 'absolute', right: 0, top: 4, zIndex: 2 }
      }
    >
      <path id="curve" opacity="1" d="M0 9 h123 c0 0 12.5 5 16 16v40" stroke="none" fill="transparent" />
      <text width="151">
        <textPath xlinkHref="#curve" fontSize={12} alignmentBaseline="middle" fill={theme.text3}>
          {text}
        </textPath>
      </text>
    </svg>
  )
}

function CurrencyLogos({ icons }: { icons: React.ReactNode[] }) {
  const constructIcons = useCallback((icons: React.ReactNode[]) => {
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
            <LogoWrapper size={36} top={106} left={168}>
              {icons[1]}
            </LogoWrapper>
            <LogoWrapper size={40} top={188} left={98}>
              {icons[2]}
            </LogoWrapper>
            <LogoWrapper size={60} top={226} left={175}>
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
            <LogoWrapper size={36} top={134} left={119}>
              {icons[2]}
            </LogoWrapper>
            <LogoWrapper size={32} top={190} left={58}>
              {icons[3]}
            </LogoWrapper>
            <LogoWrapper size={44} top={199} left={158}>
              {icons[4]}
            </LogoWrapper>
            <LogoWrapper size={40} top={270} left={195}>
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
            <LogoWrapper size={36} top={134} left={119}>
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
            <LogoWrapper size={28} top={267} left={212}>
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
  }, [])

  return <LogosContainer>{constructIcons(icons)}</LogosContainer>
}
