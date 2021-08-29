import { ButtonEmpty } from 'components/Button'
import { RowBetween, RowFixed } from 'components/Row'
import { StyledTabItem, StyledTabs } from 'components/Tabs'
import React, { useCallback, useMemo, useState } from 'react'
import { AnimatedImg, AnimatedWrapper, TYPE } from 'theme'
import { ChevronLeft } from 'react-feather'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Hr, Paragraph } from './Paragraph'
import NFTCard, { CardColor, NFTCardProps } from 'components/NFTCard'
import {
  NFTCreatorInfo,
  NFTIndexInfoProps,
  useAssetsTokens,
  useNFTCreatorInfo,
  useNFTIndexInfo
} from 'hooks/useIndexDetail'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import Loader from 'assets/svg/antimatter_background_logo.svg'
import AntimatterLogo from 'assets/svg/antimatter_logo_nft.svg'
import { WrappedTokenInfo } from 'state/lists/hooks'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import CurrencyLogo from 'components/CurrencyLogo'
import { SellComfirmModel } from '../../components/NFTSpotDetail/ComfirmModel'
import { AssetsParameter } from '../../components/Creation'
import { useNFTETHPrice } from '../../data/Reserves'
import { CurrencyAmount, JSBI, TokenAmount } from '@uniswap/sdk'
import { useAmountOutMins, useIndexSellCall } from 'hooks/useIndexSellCallback'
import { INDEX_NFT_ADDRESS } from '../../constants'
import BigNumber from 'bignumber.js'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { useActiveWeb3React } from 'hooks'
import { getEtherscanLink } from 'utils'

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
  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const [hash, setHash] = useState('')
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const transactionOnDismiss = () => {
    setError(false)
    setErrorMsg('')
    setTransactionModalOpen(false)
  }

  const { data: NFTIndexInfo } = useNFTIndexInfo(nftid)
  const creatorInfo = useNFTCreatorInfo(NFTIndexInfo?.creator)

  const tokens: AssetsParameter[] = useAssetsTokens(NFTIndexInfo?.assetsParameters)
  const {
    ethAmount: [priceState, price],
    eths
  } = useNFTETHPrice(tokens)
  console.log('🚀 ~ file: index.tsx ~ line 165 ~ priceState', priceState)

  const tokenFluiditys: (TokenAmount | null)[] = useMemo(() => {
    return eths.map(val => val[3])
  }, [eths])

  const thisNFTethAmount = CurrencyAmount.ether(JSBI.BigInt(price ?? '0'))
  // console.log('priceState', priceState)
  // console.log('price', thisNHTethAmount.raw.toString())

  const [currentSubTab, setCurrentSubTab] = useState<SubTabType>(SubTabType.Creater)
  const [sellAmount, setSellAmount] = useState('')

  const [sellConfirmModal, setSellConfirmModal] = useState(false)

  const userSlippage = useUserSlippageTolerance()
  const slippage = useMemo(() => {
    return new BigNumber(userSlippage[0])
      .dividedBy(10000)
      .toFixed(3)
      .toString()
  }, [userSlippage])
  const amountOutMins = useAmountOutMins(eths, sellAmount, slippage)

  const currentCard = useMemo((): NFTCardProps => {
    if (!NFTIndexInfo) return defaultCardData
    const _icons = tokens.map((val, idx) => {
      return <CurrencyLogo currency={val.currencyToken} key={idx} />
    })
    return {
      id: NFTIndexInfo.creatorId,
      name: NFTIndexInfo.name,
      indexId: NFTIndexInfo.creatorId,
      color: NFTIndexInfo.color,
      address: NFTIndexInfo.creator,
      icons: _icons,
      creator: creatorInfo ? creatorInfo.username : ''
    }
  }, [NFTIndexInfo, tokens, creatorInfo])

  const { callback: toSellCallback } = useIndexSellCall()
  const toSell = useCallback(() => {
    if (!toSellCallback || !sellAmount || !nftid || !amountOutMins) return
    setTransactionModalOpen(true)
    setAttemptingTxn(true)
    setSellConfirmModal(false)
    toSellCallback(nftid, sellAmount, amountOutMins)
      .then(hash => {
        setAttemptingTxn(false)
        setHash(hash)
        setSellAmount('')
      })
      .catch(err => {
        // setTransactionModalOpen(false)
        setAttemptingTxn(false)
        setError(true)
        setErrorMsg(err?.message)
        console.error('toSellCall commit', err)
      })
  }, [toSellCallback, nftid, sellAmount, amountOutMins])

  if (!NFTIndexInfo) {
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
            <StyledTabs>
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
            </StyledTabs>
            {currentSubTab === SubTabType.Creater ? (
              <CreaterInfo nftInfo={NFTIndexInfo} creatorInfo={creatorInfo} />
            ) : currentSubTab === SubTabType.Locker ? (
              <IndexInfo nftInfo={NFTIndexInfo} />
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

      <SellComfirmModel
        isOpen={sellConfirmModal}
        onDismiss={() => {
          setSellConfirmModal(false)
        }}
        tokenFluiditys={tokenFluiditys}
        ethAmount={thisNFTethAmount}
        // ETHbalance={ETHbalance ?? undefined}
        // slippage={slippage}
        number={sellAmount}
        assetsParameters={tokens}
        onConfirm={toSell}
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
      <Paragraph header="Token contract address">{INDEX_NFT_ADDRESS[chainId ?? 1]}</Paragraph>
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
