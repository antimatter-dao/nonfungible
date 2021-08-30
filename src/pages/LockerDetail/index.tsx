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
import { useLocker721Info } from 'hooks/useLocker721Detail'
import { useLockerClaim721Call } from 'hooks/useLockerClaimCallback'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import Loader from 'assets/svg/antimatter_background_logo.svg'
import AntimatterLogo from 'assets/svg/antimatter_logo_nft.svg'
import { WrappedTokenInfo } from 'state/lists/hooks'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import CurrencyLogo from 'components/CurrencyLogo'
import { AssetsParameter } from '../../components/Creation'
import { useActiveWeb3React } from 'hooks'
import { LOCKER_721_ADDRESS } from '../../constants'
import { getEtherscanLink } from 'utils'
import { Locker721ClaimComfirmModel } from 'components/NFTSpotDetail/ComfirmModel'

const Wrapper = styled.div`
  /* min-height: calc(100vh - ${({ theme }) => theme.headerHeight}); */
  width: 1192px;
  margin: auto;
  color: ${({ theme }) => theme.black};
`

const InfoPanel = styled.div`
  background: #ffffff;
  border-radius: 40px;
  width: 69%;
  padding: 26px 52px;
  min-height: 490px;
  max-height: 490px;
`
const StyledNFTCard = styled.div`
  transform-origin: 0 0;
  transform: scale(1.29);
`

const StyledAvatar = styled.div<{ wh?: string }>`
  width: ${({ wh }) => (wh ? wh : '36px')};
  height: ${({ wh }) => (wh ? wh : '36px')};
  flex-shrink: 0;
  margin-right: 12px;
  > * {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
`

const TokenWrapper = styled.div`
  width: 320px;
  padding: 22px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`
const AssetsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 40px;
  grid-template-rows: repeat(4, 1fr);
  height: 388px;
`
export const StyledLink = styled.a`
  text-decoration: none;
  color: inherit;
  &:hover {
    text-decoration: underline;
  }
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

  const [claimModal, setClaimModal] = useState(false)

  const transactionOnDismiss = () => {
    setError(false)
    setErrorMsg('')
    setTransactionModalOpen(false)
  }

  const { data: locker721Info } = useLocker721Info(nftid)
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
      })
      .catch(err => {
        // setTransactionModalOpen(false)
        setAttemptingTxn(false)
        setError(true)
        setErrorMsg(err?.message)
        console.error('to claim commit', err)
      })
  }, [toClaimCallback, nftid])

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
        <RowBetween style={{ marginTop: 10 }} align="flex-start">
          <StyledNFTCard>
            <NFTCard {...currentCard} />
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
              {account === locker721Info.creator && (
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
              <IndexInfo nftInfo={locker721Info} />
            ) : (
              <AssetsWrapper>
                {tokens.map(({ amount, currencyToken }, index) => {
                  return <AssetItem amount={amount} currencyToken={currencyToken} key={index} />
                })}
              </AssetsWrapper>
            )}
          </InfoPanel>
        </RowBetween>
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

function IndexInfo({ nftInfo }: { nftInfo: NFTIndexInfoProps }) {
  const { chainId } = useActiveWeb3React()
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
