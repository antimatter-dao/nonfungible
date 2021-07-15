import React, { useMemo } from 'react'
import styled from 'styled-components'
import { saturate, darken, opacify, adjustHue } from 'polished'
import useTheme from 'hooks/useTheme'
import { TYPE } from 'theme'
import Column, { AutoColumn } from 'components/Column'
import ProgressBar from './ProgressBar'
import CurrencyLogosOverlay from './CurrencyLogosOverlay'
import CurvedText from './CurvedText'
import { RowBetween } from 'components/Row'

export enum CardColor {
  RED = 'pastelRed',
  PURPLE = 'pastelPurple',
  YELLOW = 'pastelYellow',
  GREEN = 'pastelGreen',
  BLUE = 'pastelBlue'
}

export interface NFTCardProps {
  icons: React.ReactNode[]
  indexId: string
  creator: string
  name: string
  color: CardColor
  address: string
}

export interface NFTGovernanceCardProps {
  time: string
  title: string
  color: CardColor
  address: string
  synopsis: string
  voteFor: number
  voteAgainst: number
}

const formatSynposis = (synopsis: string) => {
  if (synopsis.length > 155) {
    return synopsis.slice(0, 150) + '...'
  }
  return synopsis
}

const CardWrapper = styled.div<{ color: CardColor }>`
  background: #ffffff;
  border-radius: 30px;
  height: 380px;
  width: 280px;
  position: relative;
  overflow: hidden;
  padding: 20px;
  cursor: pointer;
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
    opacity: 0.5;
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
  padding: 24px 20px;
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
      <CurvedText text={address} />
      <CurvedText text={address} inverted />
      <OutlineCard>{children}</OutlineCard>
    </CardWrapper>
  )
}

export default function NFTCard({ icons, indexId, creator, name, color, address }: NFTCardProps) {
  return (
    <NFTCardBase color={color} address={address}>
      <CurrencyLogosOverlay icons={icons} />
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
  address,
  synopsis,
  voteFor,
  voteAgainst
}: NFTGovernanceCardProps) {
  const theme = useTheme()
  const saturatedColor = useMemo(() => adjustHue(10, opacify(1, saturate(0.9, darken(0.3, theme[color])))), [
    color,
    theme
  ])
  return (
    <NFTCardBase color={color} address={address}>
      <Column style={{ justifyContent: 'space-between', height: '100%' }}>
        <AutoColumn gap="12px">
          <TYPE.black fontWeight={700} fontSize={24} color="#000000">
            {title}
          </TYPE.black>
          <TYPE.smallGray style={{ height: 84, overflow: 'hidden' }} fontSize={14}>
            {formatSynposis(synopsis)}
          </TYPE.smallGray>
          <Capsule color={color}>
            <TYPE.small color={saturatedColor}> {time}</TYPE.small>
          </Capsule>
        </AutoColumn>
        <AutoColumn gap="10px">
          <RowBetween>
            <TYPE.smallGray>Votes For:</TYPE.smallGray>
            <TYPE.smallGray>Votes Against:</TYPE.smallGray>
          </RowBetween>
          <ProgressBar voteFor={voteFor} voteAgainst={voteAgainst} color={theme[color]} />
          <RowBetween>
            <TYPE.small fontSize={12}>{voteFor.toLocaleString('en-US')}&nbsp;Matter</TYPE.small>
            <TYPE.small fontSize={12}>{voteAgainst.toLocaleString('en-US')}&nbsp;Matter</TYPE.small>
          </RowBetween>
        </AutoColumn>
      </Column>
    </NFTCardBase>
  )
}
