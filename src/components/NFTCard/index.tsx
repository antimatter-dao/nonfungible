import React from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { TYPE } from 'theme'
import Column, { AutoColumn } from 'components/Column'
import ProgressBar from './ProgressBar'
import CurrencyLogosOverlay from './CurrencyLogosOverlay'
import CurvedText from './CurvedText'
import { RowBetween } from 'components/Row'
import { Capsule, TimerCapsule } from './Capsule'
import { ellipsis } from 'polished'

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
  id: string | number
  noBorderArea?: boolean
}

export interface NFTGovernanceCardProps {
  time: string
  title: string
  color: CardColor
  address: string
  synopsis: string
  voteFor: number
  voteAgainst: number
  id: string | number
  voteForPercentage: string
}

const formatSynposis = (synopsis: string) => {
  if (synopsis.length > 155) {
    return synopsis.slice(0, 150) + '...'
  }
  return synopsis
}

const CardWrapper = styled.div<{ color: CardColor; padding?: string | number }>`
  background: #ffffff;
  border-radius: 30px;
  height: 380px;
  width: 280px;
  position: relative;
  overflow: hidden;
  padding: ${({ padding }) => padding ?? '20px'};
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

const OutlineCard = styled.div<{ borderRadius?: string }>`
  border: 1px solid ${({ theme }) => theme.text2};
  height: 100%;
  z-index: 3;
  border-radius: ${({ borderRadius }) => borderRadius ?? '20px'};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 20px;
  & * {
    z-index: 3;
  }
`

function NFTCardBase({
  children,
  color,
  address,
  noBorderArea,
  onClick
}: {
  children: React.ReactNode
  color: CardColor
  address: string
  noBorderArea?: boolean
  onClick?: () => void
}) {
  return (
    <CardWrapper padding={noBorderArea ? 0 : '20px'} color={color} onClick={onClick}>
      {!noBorderArea && (
        <>
          <CurvedText text={address} />
          <CurvedText text={address} inverted />
        </>
      )}
      <OutlineCard borderRadius={noBorderArea ? '30px' : '20px'}>{children}</OutlineCard>
    </CardWrapper>
  )
}

export default function NFTCard({
  icons,
  indexId,
  creator,
  name,
  color,
  address,
  noBorderArea,
  onClick
}: NFTCardProps & { onClick?: () => void }) {
  return (
    <NFTCardBase noBorderArea={noBorderArea} color={color} address={address} onClick={onClick}>
      <CurrencyLogosOverlay icons={icons} />
      <TYPE.black fontWeight={700} fontSize={28} color="#000000" style={{ ...ellipsis('100%') }}>
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
  voteAgainst,
  voteForPercentage,
  onClick
}: NFTGovernanceCardProps & { onClick: () => void }) {
  const theme = useTheme()
  return (
    <NFTCardBase color={color} address={address} onClick={onClick}>
      <Column style={{ justifyContent: 'space-between', height: '100%' }}>
        <AutoColumn gap="12px">
          <TYPE.black fontWeight={700} fontSize={24} color="#000000">
            {title}
          </TYPE.black>
          <TYPE.smallGray style={{ height: 84, overflow: 'hidden' }} fontSize={14}>
            {formatSynposis(synopsis)}
          </TYPE.smallGray>
          <TimerCapsule color={color} timeLeft={+time} />
        </AutoColumn>
        <AutoColumn gap="10px">
          <RowBetween>
            <TYPE.smallGray>Votes For:</TYPE.smallGray>
            <TYPE.smallGray>Votes Against:</TYPE.smallGray>
          </RowBetween>
          <ProgressBar leftPercentage={voteForPercentage} color={theme[color]} />
          <RowBetween>
            <TYPE.small fontSize={12}>{voteFor.toLocaleString('en-US')}&nbsp;Matter</TYPE.small>
            <TYPE.small fontSize={12}>{voteAgainst.toLocaleString('en-US')}&nbsp;Matter</TYPE.small>
          </RowBetween>
        </AutoColumn>
      </Column>
    </NFTCardBase>
  )
}
