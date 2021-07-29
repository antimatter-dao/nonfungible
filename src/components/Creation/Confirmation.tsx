import React from 'react'
import { TYPE } from '../../theme'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { RowBetween, RowFixed } from 'components/Row'
import { CreateSpotData } from './index'
import { ReactComponent as ETH } from 'assets/svg/eth_logo.svg'

const Wrapper = styled(AutoColumn)`
  padding: 24px 28px 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  max-height: 40vh;
  overflow-y: auto;
`
const RightText = styled(TYPE.small)`
  color: ${({ theme }) => theme.text6};
  max-width: 152px;
  text-align: right;
  align-self: flex-start;
`

export function SpotConfirmation({
  children,
  dataInfo
}: {
  children?: string | JSX.Element
  dataInfo: CreateSpotData
}) {
  const { creator, creatorWalletAddress, creatorId, description, name: indexName } = dataInfo
  return (
    <AutoColumn gap="40px">
      <div>
        <TYPE.largeHeader fontSize={30} color="black">
          Confirmation
        </TYPE.largeHeader>
        <TYPE.small fontSize={12}>Please review the following information </TYPE.small>
      </div>

      <Wrapper gap="20px">
        <AutoColumn gap="12px">
          <TYPE.smallHeader color="text6">Creator Info</TYPE.smallHeader>
          <RowBetween>
            <TYPE.smallGray>Creator</TYPE.smallGray>
            <RightText>{creator}</RightText>
          </RowBetween>
          <RowBetween>
            <TYPE.smallGray>IndexName</TYPE.smallGray>
            <RightText>{indexName}</RightText>
          </RowBetween>
          <RowBetween>
            <TYPE.smallGray>Creator wallet address</TYPE.smallGray>
            <RightText>{creatorWalletAddress}</RightText>
          </RowBetween>
          <RowBetween>
            <TYPE.smallGray>Creator ID</TYPE.smallGray>
            <RightText>{creatorId}</RightText>
          </RowBetween>
          <RowBetween align="flex-start">
            <TYPE.smallGray>Description</TYPE.smallGray>
            <RightText>{description}</RightText>
          </RowBetween>
        </AutoColumn>

        {/* <AutoColumn gap="12px">
          <TYPE.smallHeader color="text6">NFT info</TYPE.smallHeader>
          <RowBetween>
            <TYPE.smallGray>Creator token address</TYPE.smallGray>
            <RightText>J0xCc39y...0E6f</RightText>
          </RowBetween>
        </AutoColumn> */}

        <AutoColumn gap="12px">
          <TYPE.smallHeader color="text6">Underlying Asset</TYPE.smallHeader>
          <RowBetween>
            <RowFixed>
              <ETH style={{ marginRight: 10 }} />
              <TYPE.smallGray>YFI</TYPE.smallGray>
            </RowFixed>
            <RightText>0.1</RightText>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <ETH style={{ marginRight: 10 }} />
              <TYPE.smallGray>YFI</TYPE.smallGray>
            </RowFixed>
            <RightText>0.1</RightText>
          </RowBetween>
        </AutoColumn>

        <div style={{ height: 8 }} />
      </Wrapper>
      {children}
    </AutoColumn>
  )
}

export function LockerConfirmation({ children }: { children?: string | JSX.Element }) {
  return (
    <AutoColumn gap="40px">
      <div>
        <TYPE.largeHeader fontSize={30} color="black">
          Confirmation
        </TYPE.largeHeader>
        <TYPE.small fontSize={12}>Please review the following information </TYPE.small>
      </div>

      <Wrapper gap="20px">
        <AutoColumn gap="12px">
          <TYPE.smallHeader color="text6">Locker Content</TYPE.smallHeader>
          <RowBetween>
            <TYPE.smallGray>Locker Type</TYPE.smallGray>
            <RightText>ERC-721</RightText>
          </RowBetween>
          <RowBetween>
            <TYPE.smallGray>Locker Name</TYPE.smallGray>
            <RightText>Name</RightText>
          </RowBetween>
          <RowBetween align="flex-start">
            <TYPE.smallGray>Description</TYPE.smallGray>
            <RightText>Alice is a KOL focusing on defi system.</RightText>
          </RowBetween>
        </AutoColumn>

        <AutoColumn gap="12px">
          <TYPE.smallHeader color="text6">Time Schedule</TYPE.smallHeader>
          <RowBetween>
            <TYPE.smallGray>Unlock date</TYPE.smallGray>
            <RightText>01.02.2021</RightText>
          </RowBetween>
          <RowBetween>
            <TYPE.smallGray>Unlock time</TYPE.smallGray>
            <RightText>00:00</RightText>
          </RowBetween>
        </AutoColumn>

        <AutoColumn gap="12px">
          <TYPE.smallHeader color="text6">Locker Assetes</TYPE.smallHeader>
          <RowBetween>
            <RowFixed>
              <ETH style={{ marginRight: 10 }} />
              <TYPE.smallGray>YFI</TYPE.smallGray>
            </RowFixed>
            <RightText>100</RightText>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <ETH style={{ marginRight: 10 }} />
              <TYPE.smallGray>YFI</TYPE.smallGray>
            </RowFixed>
            <RightText>100</RightText>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <ETH style={{ marginRight: 10 }} />
              <TYPE.smallGray>YFI</TYPE.smallGray>
            </RowFixed>
            <RightText>100</RightText>
          </RowBetween>
        </AutoColumn>

        <div style={{ height: 8 }} />
      </Wrapper>
      {children}
    </AutoColumn>
  )
}
