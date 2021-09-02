import React, { useMemo } from 'react'
import { ShowSmall, TYPE, HideSmall } from '../../theme'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { RowBetween, RowFixed } from 'components/Row'
import { CreateLockerData, CreateSpotData, TimeScheduleType } from './index'
import CurrencyLogo from 'components/CurrencyLogo'
import { useWeb3React } from '@web3-react/core'
import { useCurrentUserInfo } from 'state/userInfo/hooks'
import { shortenAddress } from 'utils'
import { TokenAmount } from '@uniswap/sdk'
import { TokenFluidityErrorLine } from 'components/NFTSpotDetail/ComfirmModel'

const Wrapper = styled(AutoColumn)`
  padding: 24px 28px 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  /* max-height: 40vh; */
  /* overflow-y: auto; */
  grid-row-gap: 20px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  background: #ffffff
  grid-row-gap: 24px;
  `}
`
const RightText = styled(TYPE.small)`
  color: ${({ theme }) => theme.text6};
  max-width: 160px;
  text-align: right;
  align-self: flex-start;
  word-break: break-all;
`
const StyledHeader = styled.div`
  position: sticky;
  background: #fff;
  top: 0;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  background: #000
  `}
`

export function SpotConfirmation({
  children,
  dataInfo,
  tokenFluiditys
}: {
  children?: string | JSX.Element
  dataInfo: CreateSpotData
  tokenFluiditys: (TokenAmount | null)[]
}) {
  const { creatorId, description, name, assetsParameters } = dataInfo
  const { account } = useWeb3React()
  const userInfo = useCurrentUserInfo()
  return (
    <AutoColumn gap="40px">
      <StyledHeader>
        <HideSmall>
          <TYPE.largeHeader fontSize={30} color="black">
            Confirmation
          </TYPE.largeHeader>
          <TYPE.small fontSize={12} color="text4">
            Please review the following information
          </TYPE.small>
        </HideSmall>
        <ShowSmall>
          <TYPE.largeHeader fontSize={30} color="text1">
            Confirmation
          </TYPE.largeHeader>
          <TYPE.small fontSize={12} color="text1" style={{ marginTop: 12 }}>
            Please review the following information
          </TYPE.small>
        </ShowSmall>
      </StyledHeader>

      <Wrapper>
        <AutoColumn gap="12px">
          <TYPE.smallHeader color="text6">Creator Info</TYPE.smallHeader>
          <RowBetween>
            <TYPE.smallGray>Creator</TYPE.smallGray>
            <RightText>{userInfo?.username}</RightText>
          </RowBetween>
          <RowBetween>
            <TYPE.smallGray>IndexName</TYPE.smallGray>
            <RightText>{name}</RightText>
          </RowBetween>
          <RowBetween align="flex-start">
            <TYPE.smallGray>Creator wallet address</TYPE.smallGray>
            <RightText>{shortenAddress(account ?? '')}</RightText>
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
          {assetsParameters
            .filter(v => v.currencyToken)
            .map(({ amount, currencyToken }, index) => (
              <div key={index}>
                <RowBetween>
                  <RowFixed>
                    <CurrencyLogo currency={currencyToken} style={{ marginRight: 10 }} />
                    <TYPE.smallGray>{currencyToken?.symbol}</TYPE.smallGray>
                  </RowFixed>
                  <RightText>{amount}</RightText>
                </RowBetween>
                <TokenFluidityErrorLine tokenFluidity={tokenFluiditys[index]} />
              </div>
            ))}
        </AutoColumn>

        <div style={{ height: 8 }} />
      </Wrapper>
      {children}
    </AutoColumn>
  )
}

export function LockerConfirmation({
  children,
  dataInfo
}: {
  children?: string | JSX.Element
  dataInfo: CreateLockerData
}) {
  const { account } = useWeb3React()
  const userInfo = useCurrentUserInfo()

  const unlockText: undefined | string[][] = useMemo(() => {
    if (dataInfo.schedule === TimeScheduleType.OneTIme) {
      const ret = [dataInfo.unlockData.datetime ? dataInfo.unlockData.datetime.toLocaleString('en-US') : '', '100%']
      return [ret]
    } else if (dataInfo.schedule === TimeScheduleType.Shedule) {
      const numbers = Number(dataInfo.unlockData.unlockNumbers)
      const rote = (100 / numbers).toFixed(2) + '%'
      const nowTIme = Number(new Date().getTime())
      const _result = []
      let idx = 0
      while (idx < numbers) {
        idx++
        const unLockTIme = nowTIme + idx * 86400000 * Number(dataInfo.unlockData.unlockInterval)
        _result.push([new Date(unLockTIme).toLocaleString('en-US'), rote])
      }
      return _result
    } else {
      return undefined
    }
  }, [dataInfo])

  return (
    <AutoColumn gap="40px">
      <div>
        <TYPE.largeHeader fontSize={30} color="black">
          Confirmation
        </TYPE.largeHeader>
        <TYPE.small fontSize={12} color="text4">
          Please review the following information{' '}
        </TYPE.small>
      </div>

      <Wrapper gap="20px">
        <AutoColumn gap="12px">
          <TYPE.smallHeader color="text6">Locker Content</TYPE.smallHeader>
          <RowBetween>
            <TYPE.smallGray>Locker Type</TYPE.smallGray>
            <RightText>{dataInfo.creationType}</RightText>
          </RowBetween>
          <RowBetween>
            <TYPE.smallGray>Creator</TYPE.smallGray>
            <RightText>{userInfo?.username}</RightText>
          </RowBetween>
          <RowBetween align="flex-start">
            <TYPE.smallGray>Creator wallet address</TYPE.smallGray>
            <RightText>{shortenAddress(account ?? '')}</RightText>
          </RowBetween>
          <RowBetween>
            <TYPE.smallGray>Locker Name</TYPE.smallGray>
            <RightText>{dataInfo.name}</RightText>
          </RowBetween>
          <RowBetween align="flex-start">
            <TYPE.smallGray>Description</TYPE.smallGray>
            <RightText>{dataInfo.message}</RightText>
          </RowBetween>
        </AutoColumn>

        <AutoColumn gap="12px">
          <TYPE.smallHeader color="text6">Time Schedule</TYPE.smallHeader>
          {dataInfo.schedule === TimeScheduleType.Flexible && (
            <RowBetween>
              <TYPE.smallGray>No lockup</TYPE.smallGray>
            </RowBetween>
          )}
          {dataInfo.schedule === TimeScheduleType.OneTIme &&
            unlockText?.map((item, index) => (
              <AutoColumn gap="5px" key={index}>
                <RowBetween>
                  <TYPE.smallGray>Unlock dateTime</TYPE.smallGray>
                  <RightText>{item[0]}</RightText>
                </RowBetween>
                <RowBetween>
                  <TYPE.smallGray>Unlock percentage</TYPE.smallGray>
                  <RightText>{item[1]}</RightText>
                </RowBetween>
              </AutoColumn>
            ))}
          {dataInfo.schedule === TimeScheduleType.Shedule &&
            unlockText?.map((item, index) => (
              <AutoColumn gap="5px" key={index}>
                <RowBetween>
                  <TYPE.smallGray>Unlock dateTime</TYPE.smallGray>
                  <RightText>{item[0]}</RightText>
                </RowBetween>
                <RowBetween>
                  <TYPE.smallGray>Unlock percentage</TYPE.smallGray>
                  <RightText>{item[1]}</RightText>
                </RowBetween>
              </AutoColumn>
            ))}
        </AutoColumn>

        <AutoColumn gap="12px">
          <TYPE.smallHeader color="text6">Locker Assetes</TYPE.smallHeader>
          {dataInfo.assetsParameters
            .filter(v => v.currencyToken)
            .map(({ amount, currencyToken }, index) => (
              <div key={index}>
                <RowBetween>
                  <RowFixed>
                    <CurrencyLogo currency={currencyToken} style={{ marginRight: 10 }} />
                    <TYPE.smallGray>{currencyToken?.symbol}</TYPE.smallGray>
                  </RowFixed>
                  <RightText>{amount}</RightText>
                </RowBetween>
              </div>
            ))}
        </AutoColumn>

        <div style={{ height: 8 }} />
      </Wrapper>
      {children}
    </AutoColumn>
  )
}
