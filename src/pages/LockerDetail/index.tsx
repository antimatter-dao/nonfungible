import { ButtonBlack, ButtonEmpty } from 'components/Button'
import { RowBetween, RowFixed } from 'components/Row'
import { StyledTabItem } from 'components/Tabs'
import React, { useCallback, useMemo, useState } from 'react'
import { AnimatedImg, AnimatedWrapper, TYPE } from 'theme'
import { ChevronLeft } from 'react-feather'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Hr, Paragraph } from './Paragraph'
import NFTCard, { CardColor, NFTCardProps } from 'components/NFTCard'
import { NFTCreatorInfo, NFTIndexInfoProps, useAssetsTokens, useNFTCreatorInfo } from 'hooks/useIndexDetail'
import { useOwnerOf } from 'hooks/useOwnerOf'
import { UnClaimListProps, useLocker721Info } from 'hooks/useLocker721Detail'
import { useLockerClaim721Call } from 'hooks/useLockerClaimCallback'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import Loader from 'assets/svg/antimatter_background_logo.svg'
import AntimatterLogo from 'assets/svg/antimatter_logo_nft.svg'
import { WrappedTokenInfo } from 'state/lists/hooks'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import CurrencyLogo from 'components/CurrencyLogo'
import { AssetsParameter, TimeScheduleType } from '../../components/Creation'
import { useActiveWeb3React } from 'hooks'
import { LOCKER_721_ADDRESS } from '../../constants'
import { getEtherscanLink } from 'utils'
import { Locker721ClaimComfirmModel, LockerShowTimeScheduleModel } from 'components/NFTSpotDetail/ComfirmModel'
import { Wrapper, InfoPanel, StyledNFTCard, StyledAvatar, TokenWrapper, AssetsWrapper } from 'pages/CardDetail'

export const ContentWrapper = styled(RowBetween)`
  margin-top: 30px;
  align-items: flex-start;
  grid-gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column;
  align-items: center;
  margin-top: 0;
  min-width: 312px;
  `}
`

const StyledNotExist = styled.div`
  font-size: 20px;
  color: #fff;
`

export const StyledLink = styled.a`
  text-decoration: none;
  color: inherit;
  &:hover {
    text-decoration: underline;
  }
`
const StyledShowTimeBtn = styled.span`
  color: #24ff00;
  margin-left: 5px;
  text-decoration: underline;
  cursor: pointer;
`

export enum SubTabType {
  'Creater' = 'creater',
  'Locker' = 'locker',
  'Underlying' = 'underlying'
}

const defaultCardData = {
  id: '',
  name: '',
  indexId: '',
  color: CardColor.RED,
  address: '',
  icons: [],
  creator: ''
}

export default function LockerDetail({
  match: {
    params: { nftid }
  }
}: RouteComponentProps<{ nftid?: string }>) {
  const theme = useTheme()
  const history = useHistory()
  const { account } = useActiveWeb3React()
  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const [hash, setHash] = useState('')
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const ownerOf = useOwnerOf(nftid)

  const [claimModal, setClaimModal] = useState(false)

  const transactionOnDismiss = () => {
    setError(false)
    setErrorMsg('')
    setTransactionModalOpen(false)
  }

  const { data: locker721Info, unClaimList, isExist } = useLocker721Info(nftid)
  const creatorInfo = useNFTCreatorInfo(locker721Info?.creator)

  const tokens: AssetsParameter[] = useAssetsTokens(locker721Info?.assetsParameters)

  const [currentSubTab, setCurrentSubTab] = useState<SubTabType>(SubTabType.Creater)

  const currentCard = useMemo((): NFTCardProps => {
    if (!locker721Info) return defaultCardData
    const _icons = tokens.map((val, idx) => {
      return <CurrencyLogo currency={val.currencyToken} key={idx} />
    })
    return {
      id: locker721Info.creatorId,
      name: locker721Info.name,
      indexId: locker721Info.creatorId,
      color: locker721Info.color,
      address: locker721Info.creator,
      icons: _icons,
      creator: creatorInfo ? creatorInfo.username : ''
    }
  }, [locker721Info, tokens, creatorInfo])

  const { callback: toClaimCallback } = useLockerClaim721Call()
  const toClaim = useCallback(() => {
    if (!toClaimCallback || !nftid) return
    setTransactionModalOpen(true)
    setAttemptingTxn(true)
    toClaimCallback(nftid)
      .then(hash => {
        setAttemptingTxn(false)
        setHash(hash)
        setClaimModal(false)
      })
      .catch(err => {
        // setTransactionModalOpen(false)
        setAttemptingTxn(false)
        setError(true)
        setErrorMsg(err?.message)
        console.error('to claim commit', err)
      })
  }, [toClaimCallback, nftid])

  if (isExist) {
    return <StyledNotExist>NFT does not exist</StyledNotExist>
  }

  if (!locker721Info) {
    return (
      <AnimatedWrapper>
        <AnimatedImg>
          <img src={Loader} alt="loading-icon" />
        </AnimatedImg>
      </AnimatedWrapper>
    )
  }
  return (
    <>
      <RowBetween style={{ padding: '27px 20px' }}>
        <ButtonEmpty width="auto" color={theme.text1}>
          <RowFixed onClick={() => history.goBack()}>
            <ChevronLeft />
            Go Back
          </RowFixed>
        </ButtonEmpty>
        <div style={{ width: 110 }} />
      </RowBetween>
      <Wrapper>
        <ContentWrapper>
          <StyledNFTCard>
            <NFTCard createName="Locker ID" {...currentCard} />
          </StyledNFTCard>
          <InfoPanel>
            <RowBetween style={{ marginBottom: 10 }}>
              <RowFixed>
                <StyledTabItem
                  current={currentSubTab === SubTabType.Creater}
                  onClick={() => setCurrentSubTab(SubTabType.Creater)}
                >
                  Creator info
                </StyledTabItem>
                <StyledTabItem
                  current={currentSubTab === SubTabType.Locker}
                  onClick={() => setCurrentSubTab(SubTabType.Locker)}
                >
                  Locker info
                </StyledTabItem>
                <StyledTabItem
                  current={currentSubTab === SubTabType.Underlying}
                  onClick={() => setCurrentSubTab(SubTabType.Underlying)}
                >
                  Underlying asset
                </StyledTabItem>
              </RowFixed>
              {account === ownerOf && (
                // locker721Info.assetsParameters[0] &&
                // JSBI.GT(JSBI.BigInt(locker721Info.assetsParameters[0].unClaimAmount ?? 0), JSBI.BigInt(0)) && (
                <RowFixed>
                  <ButtonBlack width="140px" height="44px" onClick={() => setClaimModal(true)}>
                    Claim Tokens
                  </ButtonBlack>
                  {/* <ButtonBlack width="100px" height="44px" marginLeft="10px">
                  Send
                </ButtonBlack> */}
                </RowFixed>
              )}
            </RowBetween>
            {currentSubTab === SubTabType.Creater ? (
              <CreaterInfo nftInfo={locker721Info} creatorInfo={creatorInfo} />
            ) : currentSubTab === SubTabType.Locker ? (
              <LockerInfo nftInfo={locker721Info} unClaimList={unClaimList} />
            ) : (
              <AssetsWrapper>
                {tokens.map(({ amount, currencyToken }, index) => {
                  return <AssetItem amount={amount} currencyToken={currencyToken} key={index} />
                })}
              </AssetsWrapper>
            )}
          </InfoPanel>
        </ContentWrapper>
      </Wrapper>

      <TransactionConfirmationModal
        isOpen={transactionModalOpen}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onDismiss={transactionOnDismiss}
        hash={hash}
        attemptingTxn={attemptingTxn}
        error={error}
        errorMsg={errorMsg}
      />

      <Locker721ClaimComfirmModel
        assetsParameters={locker721Info.assetsParameters}
        onConfirm={toClaim}
        isOpen={claimModal}
        onDismiss={() => setClaimModal(false)}
      />
    </>
  )
}

function CreaterInfo({
  nftInfo,
  creatorInfo
}: {
  nftInfo: NFTIndexInfoProps
  creatorInfo: NFTCreatorInfo | undefined
}) {
  return (
    <div>
      <RowFixed>
        <StyledAvatar>
          <img src={AntimatterLogo} alt="" />
        </StyledAvatar>
        <Paragraph header="Creator">{creatorInfo?.username}</Paragraph>
      </RowFixed>
      <Hr />
      <Paragraph header="Creator Wallet Address">{nftInfo.creator}</Paragraph>
      <Hr />
      <Paragraph header="Creator ID">#{nftInfo.creatorId}</Paragraph>
      <Hr />
      <Paragraph header="Bio">{creatorInfo?.bio}</Paragraph>
    </div>
  )
}

function LockerInfo({
  nftInfo,
  unClaimList
}: {
  nftInfo: NFTIndexInfoProps
  unClaimList: (UnClaimListProps | undefined)[]
}) {
  const { chainId } = useActiveWeb3React()
  const [showTimeScheduleModel, setShowTimeScheduleModel] = useState(false)

  const { currentScheduleType, datetimeArray } = useMemo(() => {
    let scheduleType: TimeScheduleType = TimeScheduleType.Flexible
    const datetimeArray: { [index: string]: UnClaimListProps[] } = {}
    if (datetimeArray) {
      unClaimList.forEach(item => {
        if (!item) return
        for (const { currencyToken } of nftInfo.assetsParameters) {
          if (item.token === currencyToken?.address) {
            item.currencyToken = currencyToken
            break
          }
        }

        if (datetimeArray[item.claimAt]) datetimeArray[item.claimAt] = [...datetimeArray[item.claimAt], item]
        else datetimeArray[item.claimAt] = [item]
      })
    }

    if (Object.keys(datetimeArray).length > 1) {
      scheduleType = TimeScheduleType.Shedule
    } else if (Object.keys(datetimeArray).length === 1 && datetimeArray['0']) {
      scheduleType = TimeScheduleType.Flexible
    } else {
      scheduleType = TimeScheduleType.OneTIme
    }
    return { currentScheduleType: scheduleType, datetimeArray }
  }, [unClaimList, nftInfo])

  return (
    <div>
      <Paragraph header="Token contract address">{LOCKER_721_ADDRESS[chainId ?? 1]}</Paragraph>
      <Hr />
      <Paragraph header="Index name">{nftInfo.name}</Paragraph>
      <Hr />
      {/* <Paragraph header="Current issuance">123</Paragraph>
      <Hr /> */}
      <Paragraph header="Description" textWidth="387px">
        {nftInfo.description}
      </Paragraph>
      <Paragraph header="Locker time schedule" textWidth="387px">
        {currentScheduleType === TimeScheduleType.Flexible ? (
          TimeScheduleType.Flexible
        ) : currentScheduleType === TimeScheduleType.OneTIme ? (
          <>
            {TimeScheduleType.OneTIme}
            <StyledShowTimeBtn onClick={() => setShowTimeScheduleModel(true)}>(view)</StyledShowTimeBtn>
          </>
        ) : (
          <>
            {TimeScheduleType.Shedule}
            <StyledShowTimeBtn onClick={() => setShowTimeScheduleModel(true)}>(view)</StyledShowTimeBtn>
          </>
        )}
      </Paragraph>
      <LockerShowTimeScheduleModel
        dataList={datetimeArray}
        isOpen={showTimeScheduleModel}
        onDismiss={() => setShowTimeScheduleModel(false)}
      />
    </div>
  )
}

function AssetItem({ amount, currencyToken }: { amount: string; currencyToken: WrappedTokenInfo | undefined }) {
  const { chainId } = useActiveWeb3React()
  return (
    <TokenWrapper>
      <RowFixed style={{ width: '100%' }}>
        <StyledAvatar wh="32px">
          <CurrencyLogo currency={currencyToken} />
        </StyledAvatar>
        <RowBetween>
          <StyledLink
            target="_blank"
            href={getEtherscanLink(chainId ?? 1, currencyToken ? currencyToken.address ?? '' : '', 'token')}
          >
            <TYPE.subHeader>{currencyToken?.symbol}</TYPE.subHeader>
          </StyledLink>
          <TYPE.black color={'black'} fontWeight={400}>
            {amount}
          </TYPE.black>
        </RowBetween>
      </RowFixed>
    </TokenWrapper>
  )
}
