import { ButtonBlack, ButtonEmpty, ButtonWhite } from 'components/Button'
import { RowBetween, RowFixed } from 'components/Row'
import { StyledTabItem, StyledTabs } from 'components/Tabs'
import React, { useCallback, useMemo, useState } from 'react'
import { AnimatedImg, AnimatedWrapper, TYPE } from 'theme'
import { ChevronLeft } from 'react-feather'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Hr, Paragraph } from './Paragraph'
import NFTCard, { CardColor, NFTCardProps } from 'components/NFTCard'
import { AutoColumn, ColumnCenter } from 'components/Column'
import {
  NFTCreatorInfo,
  NFTIndexInfoProps,
  useAssetsTokens,
  useNFTBalance,
  useNFTCreatorInfo,
  useNFTIndexInfo,
  useNFTTransactionRecords
} from 'hooks/useIndexDetail'
import NumericalInput from 'components/NumericalInput'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import Loader from 'assets/svg/antimatter_background_logo.svg'
import AntimatterLogo from 'assets/svg/logo.svg'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { useAmountInMins, useCalcBuyFee, useIndexBuyCall } from '../../hooks/useIndexBuyCallback'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import { CurrencyNFTInputPanel } from 'components/CurrencyInputPanel'
import { useCurrency } from 'hooks/Tokens'
import CurrencyLogo from 'components/CurrencyLogo'
import { NumberNFTInputPanel } from 'components/NumberInputPanel'
import { BuyComfirmModel, SellComfirmModel } from '../../components/NFTSpotDetail/ComfirmModel'
import { AssetsParameter } from '../../components/Creation'
import { PriceState, useNFTETHPrice } from '../../data/Reserves'
import { CurrencyAmount, JSBI } from '@uniswap/sdk'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useWeb3React } from '@web3-react/core'
import { useAmountOutMins, useIndexSellCall } from 'hooks/useIndexSellCallback'
import { INDEX_NFT_ADDRESS, INDEX_NFT_BUY_FEE } from '../../constants'
import SettingsTab from 'components/Settings'
import BigNumber from 'bignumber.js'
import { useUserSlippageTolerance } from 'state/user/hooks'
import TransactionsTable from './TransactionsTable'

const Wrapper = styled.div`
  min-height: calc(100vh - ${({ theme }) => theme.headerHeight});
  width: 1192px;
  margin: auto;
  color: ${({ theme }) => theme.black};
`
const TabButton = styled(ButtonWhite)<{ current?: string | boolean }>`
  width: 152px;
  color: ${({ theme, current }) => (current ? theme.black : theme.white)};
  background-color: ${({ theme, current }) => (current ? theme.white : 'transparent')};
  border-color: ${({ theme }) => theme.white};
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
  flex-shrink: 1;
  margin-right: 12px;
  > * {
    background-color: #eee;
    width: 100%;
    height: 100%;
  }
`
// const TokenButtonDropdown = styled(ButtonDropdown)`
//   background: linear-gradient(0deg, #ffffff, #ffffff);
//   border: 1px solid rgba(0, 0, 0, 0.1);
//   border-radius: 10px;
//   font-weight: normal;
// `

const CustomNumericalInput = styled(NumericalInput)`
  background: transparent;
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  color: ${({ theme }) => theme.black};
`

const BuyPannel = styled(ColumnCenter)`
  color: ${({ theme }) => theme.black};
  padding-top: 20px;
  padding-right: 40px;
  height: 360px;
  align-items: flex-start;
  justify-content: space-between;
`
const MarketPrice = styled(RowBetween)`
  border: 1px solid #000000;
  border-radius: 14px;
  height: 52px;
  margin: 24px 0;
  padding: 10px 20px;
`

const TokenWrapper = styled.div`
  width: 320px;
  padding: 22px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`
const AssetsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 40px;
  grid-template-rows: repeat(4, 1fr);
  height: 388px;
`
const TradeWrapper = styled(AutoColumn)`
  grid-template-columns: 1fr 1fr;
`

export enum TabType {
  'Information' = 'Information',
  'Trade' = 'Trade'
}

export enum SubTabType {
  'Creater' = 'creater',
  'Index' = 'index',
  'Underlying' = 'underlying'
}

export enum TradeTabType {
  'Buy' = 'buy',
  'Sell' = 'sell'
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

export default function CardDetail({
  match: {
    params: { nftid }
  }
}: RouteComponentProps<{ nftid?: string }>) {
  const { account } = useWeb3React()
  const theme = useTheme()
  const history = useHistory()
  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const [hash, setHash] = useState('')
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const ETHCurrency = useCurrency('ETH')

  const transactionOnDismiss = () => {
    setError(false)
    setErrorMsg('')
    setTransactionModalOpen(false)
  }

  const { loading: NFTIndexLoading, data: NFTIndexInfo } = useNFTIndexInfo(nftid)
  const creatorInfo = useNFTCreatorInfo(NFTIndexInfo?.creator)
  const NFTTransactionRecords = useNFTTransactionRecords(nftid)

  const { data: NFTbalance } = useNFTBalance(nftid)

  const ETHbalance = useCurrencyBalance(account ?? undefined, ETHCurrency ?? undefined)

  const tokens: AssetsParameter[] = useAssetsTokens(NFTIndexInfo?.assetsParameters)
  const {
    ethAmount: [priceState, price],
    eths
  } = useNFTETHPrice(tokens)

  const thisNFTethAmount = CurrencyAmount.ether(JSBI.BigInt(price ?? '0'))
  // console.log('priceState', priceState)
  // console.log('price', thisNHTethAmount.raw.toString())

  const [currentSubTab, setCurrentSubTab] = useState<SubTabType>(SubTabType.Creater)
  const [currentTab, setCurrentTab] = useState<TabType>(TabType.Information)
  const [currentTradeTab, setCurrentTradeTab] = useState<TradeTabType>(TradeTabType.Buy)
  const [buyAmount, setBuyAmount] = useState('')
  const [sellAmount, setSellAmount] = useState('')

  const [buyConfirmModal, setBuyConfirmModal] = useState(false)
  const [sellConfirmModal, setSellConfirmModal] = useState(false)

  const userSlippage = useUserSlippageTolerance()
  const slippage = useMemo(() => {
    return new BigNumber(userSlippage[0])
      .dividedBy(10000)
      .toFixed(3)
      .toString()
  }, [userSlippage])
  const buyFee = useCalcBuyFee(thisNFTethAmount?.raw.toString(), buyAmount, slippage)
  const amountInMins = useAmountInMins(eths, buyAmount, slippage)
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

  const { callback: toBuyCall } = useIndexBuyCall()
  const toBuy = useCallback(() => {
    if (!buyAmount || !toBuyCall || !nftid || !buyFee || !amountInMins) return

    setTransactionModalOpen(true)
    setAttemptingTxn(true)
    setBuyConfirmModal(false)
    toBuyCall(nftid, buyAmount, amountInMins, buyFee)
      .then(hash => {
        setAttemptingTxn(false)
        setHash(hash)
        setBuyAmount('')
      })
      .catch(err => {
        // setTransactionModalOpen(false)
        setAttemptingTxn(false)
        setError(true)
        setErrorMsg(err?.message)
        console.error('toBuyCall commit', err)
      })
  }, [buyAmount, toBuyCall, nftid, buyFee, amountInMins])

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

  if (NFTIndexLoading || !NFTIndexInfo) {
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
        <RowBetween style={{ width: 320 }}>
          <TabButton current={currentTab === TabType.Information} onClick={() => setCurrentTab(TabType.Information)}>
            Information
          </TabButton>
          <TabButton current={currentTab === TabType.Trade} onClick={() => setCurrentTab(TabType.Trade)}>
            Trade
          </TabButton>
        </RowBetween>
        <div style={{ width: 110 }} />
      </RowBetween>
      <Wrapper>
        <RowBetween style={{ marginTop: 70 }} align="flex-start">
          <StyledNFTCard>
            <NFTCard {...currentCard} />
          </StyledNFTCard>
          {currentTab === TabType.Information ? (
            <InfoPanel>
              <StyledTabs>
                <StyledTabItem
                  current={currentSubTab === SubTabType.Creater}
                  onClick={() => setCurrentSubTab(SubTabType.Creater)}
                >
                  Creator info
                </StyledTabItem>
                <StyledTabItem
                  current={currentSubTab === SubTabType.Index}
                  onClick={() => setCurrentSubTab(SubTabType.Index)}
                >
                  Index info
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
              ) : currentSubTab === SubTabType.Index ? (
                <IndexInfo nftInfo={NFTIndexInfo} />
              ) : (
                <AssetsWrapper>
                  {tokens.map(({ amount, currencyToken }, index) => {
                    return <AssetItem amount={amount} currencyToken={currencyToken} key={index} />
                  })}
                </AssetsWrapper>
              )}
            </InfoPanel>
          ) : (
            <InfoPanel>
              <TradeWrapper>
                <>
                  <div>
                    <StyledTabs>
                      <StyledTabItem
                        current={currentTradeTab === TradeTabType.Buy}
                        onClick={() => setCurrentTradeTab(TradeTabType.Buy)}
                      >
                        Buy
                      </StyledTabItem>
                      <StyledTabItem
                        current={currentTradeTab === TradeTabType.Sell}
                        onClick={() => setCurrentTradeTab(TradeTabType.Sell)}
                      >
                        Sell
                      </StyledTabItem>
                    </StyledTabs>

                    {currentTradeTab === TradeTabType.Buy && (
                      <BuyPannel>
                        <AutoColumn gap="8px" style={{ width: '100%' }}>
                          <TYPE.black color="black">Amount </TYPE.black>
                          <CustomNumericalInput
                            style={{
                              width: 'unset',
                              height: '60px'
                            }}
                            maxLength={6}
                            isInt={true}
                            placeholder="0"
                            value={buyAmount}
                            onUserInput={val => {
                              setBuyAmount(val)
                            }}
                          />
                        </AutoColumn>
                        <AutoColumn gap="8px" style={{ width: '100%' }}>
                          <RowBetween>
                            <TYPE.black color="black">Payment Currency </TYPE.black>
                            <SettingsTab onlySlippage={true} />
                          </RowBetween>
                          <CurrencyETHShow />
                        </AutoColumn>
                        <ButtonBlack
                          onClick={() => {
                            setBuyConfirmModal(true)
                          }}
                          height={60}
                          disabled={!Number(buyAmount) || !thisNFTethAmount}
                        >
                          Buy
                        </ButtonBlack>
                      </BuyPannel>
                    )}

                    {currentTradeTab === TradeTabType.Sell && (
                      <BuyPannel>
                        <AutoColumn gap="8px" style={{ width: '100%' }}>
                          <NumberNFTInputPanel
                            value={sellAmount}
                            onUserInput={val => {
                              setSellAmount(val)
                            }}
                            intOnly={true}
                            label="Amount"
                            onMax={() => {
                              setSellAmount(NFTbalance?.toString() ?? '0')
                            }}
                            balance={NFTbalance?.toString()}
                            error={Number(sellAmount) > Number(NFTbalance?.toString()) ? 'Insufficient balance' : ''}
                            showMaxButton={true}
                            id="sell_id"
                          />
                        </AutoColumn>
                        <AutoColumn gap="8px" style={{ width: '100%' }}>
                          <RowBetween>
                            <TYPE.black color="black">Payment Currency </TYPE.black>
                            <SettingsTab onlySlippage={true} />
                          </RowBetween>
                          <CurrencyETHShow />
                        </AutoColumn>
                        <ButtonBlack
                          onClick={() => {
                            setSellConfirmModal(true)
                          }}
                          height={60}
                          disabled={!Number(sellAmount) || Number(sellAmount) > Number(NFTbalance?.toString())}
                        >
                          Sell
                        </ButtonBlack>
                      </BuyPannel>
                    )}
                  </div>

                  <div>
                    <MarketPrice>
                      <span>Market price per unit</span>
                      <span>{priceState === PriceState.VALID ? thisNFTethAmount.toSignificant(6) : '--'} ETH</span>
                    </MarketPrice>
                    <div>
                      <TransactionsTable transactionRecords={NFTTransactionRecords} />
                      {!NFTTransactionRecords?.length && (
                        <TYPE.darkGray textAlign="center" padding="10px">
                          No transaction record
                        </TYPE.darkGray>
                      )}
                    </div>
                  </div>
                </>
              </TradeWrapper>
            </InfoPanel>
          )}
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

      <BuyComfirmModel
        isOpen={buyConfirmModal}
        onDismiss={() => {
          setBuyConfirmModal(false)
        }}
        fee={INDEX_NFT_BUY_FEE}
        slippage={slippage}
        ethAmount={thisNFTethAmount}
        ETHbalance={ETHbalance ?? undefined}
        number={buyAmount}
        assetsParameters={tokens}
        onConfirm={toBuy}
      />

      <SellComfirmModel
        isOpen={sellConfirmModal}
        onDismiss={() => {
          setSellConfirmModal(false)
        }}
        ethAmount={thisNFTethAmount}
        ETHbalance={ETHbalance ?? undefined}
        slippage={slippage}
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
  return (
    <div>
      <Paragraph header="Token contract address">{INDEX_NFT_ADDRESS}</Paragraph>
      <Hr />
      {/* <Paragraph header="Current issuance">123</Paragraph>
      <Hr /> */}
      <Paragraph header="Description">{nftInfo.description}</Paragraph>
    </div>
  )
}

function AssetItem({ amount, currencyToken }: { amount: string; currencyToken: WrappedTokenInfo | undefined }) {
  return (
    <TokenWrapper>
      <RowFixed style={{ width: '100%' }}>
        <StyledAvatar wh="32px">
          <CurrencyLogo currency={currencyToken} />
        </StyledAvatar>
        <RowBetween>
          <TYPE.subHeader>{currencyToken?.symbol}</TYPE.subHeader>
          <TYPE.black color={'black'} fontWeight={400}>
            {amount}
          </TYPE.black>
        </RowBetween>
      </RowFixed>
    </TokenWrapper>
  )
}

function CurrencyETHShow() {
  const ETHCurrency = useCurrency('ETH')

  return (
    <CurrencyNFTInputPanel
      hiddenLabel={true}
      value={''}
      onUserInput={() => {}}
      // onMax={handleMax}
      currency={ETHCurrency}
      // pair={dummyPair}
      showMaxButton={false}
      // label="Amount"
      disableCurrencySelect={true}
      id="stake-liquidity-token"
      hideSelect={false}
      hideInput={true}
    />
  )
}
