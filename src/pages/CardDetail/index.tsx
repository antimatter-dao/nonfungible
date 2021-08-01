import { ButtonBlack, ButtonEmpty, ButtonWhite } from 'components/Button'
import { RowBetween, RowFixed } from 'components/Row'
import { StyledTabItem, StyledTabs } from 'components/Tabs'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatedImg, AnimatedWrapper, TYPE } from 'theme'
import { ChevronLeft } from 'react-feather'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Hr, Paragraph } from './Paragraph'
import NFTCard, { CardColor, NFTCardProps } from 'components/NFTCard'
import { AutoColumn, ColumnCenter } from 'components/Column'
import { createChart, IChartApi, ISeriesApi, LineStyle } from 'lightweight-charts'
import { DexTradeData, getDexTradeList } from 'utils/option/httpRequests'
// import { currencyId } from 'utils/currencyId'
import { useNetwork } from 'hooks/useNetwork'
import { NFTIndexInfoProps, useAssetsTokens, useNFTIndexInfo } from 'hooks/useIndexDetail'
import NumericalInput from 'components/NumericalInput'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import Loader from 'assets/svg/antimatter_background_logo.svg'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { useIndexBuyCall } from '../../hooks/useIndexBuyCallback'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import { CurrencyNFTInputPanel } from 'components/CurrencyInputPanel'
import { useCurrency } from 'hooks/Tokens'
import CurrencyLogo from 'components/CurrencyLogo'
import { AssetsParameter } from '../../components/Creation'
import { PriceState, useNFTETHPrice } from '../../data/Reserves'
import { CurrencyAmount, JSBI } from '@uniswap/sdk'

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

  const ETHCurrency = useCurrency('ETH')

  const { loading: NFTIndexLoading, data: NFTIndexInfo } = useNFTIndexInfo(nftid)

  const tokens: AssetsParameter[] = useAssetsTokens(NFTIndexInfo?.assetsParameters)
  const [priceState, price] = useNFTETHPrice(tokens)
  const ethAmount = CurrencyAmount.ether(JSBI.BigInt(price ?? '0'))
  console.log('priceState', priceState)
  console.log('price', ethAmount.raw.toString())

  const [currentSubTab, setCurrentSubTab] = useState<SubTabType>(SubTabType.Creater)
  const [currentTab, setCurrentTab] = useState<TabType>(TabType.Information)
  const [currentTradeTab, setCurrentTradeTab] = useState<TradeTabType>(TradeTabType.Buy)
  const [buyAmount, setBuyAmount] = useState('')

  const [priceChartData, setPriceChartData] = useState<DexTradeData[] | undefined>()
  const [candlestickSeries, setCandlestickSeries] = useState<ISeriesApi<'Candlestick'> | undefined>(undefined)
  const [chart, setChart] = useState<IChartApi | undefined>(undefined)
  const currencyA = undefined
  const {
    httpHandlingFunctions: { errorFunction }
    // networkErrorModal
  } = useNetwork()
  useEffect(() => {
    const id = currencyA
    if (id) {
      getDexTradeList(
        (list: DexTradeData[] | undefined) => {
          setPriceChartData(list)
        },
        id,
        errorFunction
      )
    }
  }, [currencyA, errorFunction])

  useEffect(() => {
    if (!document.getElementById('chart')) return
    const chart = createChart(document.getElementById('chart') ?? '', {
      width: 556,
      height: 354,
      // watermark: {
      //   visible: true,
      //   fontSize: 24,
      //   horzAlign: 'left',
      //   vertAlign: 'top',
      //   color: '#FFFFFF',
      //   text: '327.4739'
      // },
      layout: {
        backgroundColor: '#000000',
        textColor: '#FFFFFF',
        fontSize: 12,
        fontFamily: 'Roboto'
      },
      grid: {
        vertLines: {
          style: LineStyle.Dotted,
          color: 'rgba(255, 255, 255, 0.4)'
        },
        horzLines: {
          style: LineStyle.Dotted,
          color: 'rgba(255, 255, 255, 0.4)'
        }
      }
    })
    chart.applyOptions({
      rightPriceScale: { autoScale: true },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        shiftVisibleRangeOnNewBar: true,
        tickMarkFormatter: (time: any) => {
          const date = new Date(time)
          const year = date.getUTCFullYear()
          const month = date.getUTCMonth()
          const day = date.getUTCDate()
          return year + '/' + month + '/' + day
        }
      },
      crosshair: {
        vertLine: {
          labelVisible: false
        }
      }
    })
    setChart(chart)
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#33E74F',
      downColor: '#FF0000',
      wickVisible: false,
      priceFormat: {
        type: 'price',
        precision: 2
      }
    })
    setCandlestickSeries(candlestickSeries)
  }, [])

  useEffect(() => {
    if (candlestickSeries) {
      priceChartData && candlestickSeries.setData(priceChartData)
    }
    if (chart) {
      chart.timeScale().fitContent()
    }
  }, [candlestickSeries, priceChartData, chart])

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
      creator: NFTIndexInfo.creatorName
    }
  }, [NFTIndexInfo, tokens])

  const { callback: toBuyCall } = useIndexBuyCall()
  const toBuy = useCallback(() => {
    if (!buyAmount || !toBuyCall || !nftid) return

    setTransactionModalOpen(true)
    setAttemptingTxn(true)
    toBuyCall(nftid, buyAmount)
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
  }, [buyAmount, toBuyCall, nftid])

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
                <CreaterInfo info={NFTIndexInfo} />
              ) : currentSubTab === SubTabType.Index ? (
                <IndexInfo info={NFTIndexInfo} />
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
                    <BuyPannel>
                      <AutoColumn gap="8px" style={{ width: '100%' }}>
                        <TYPE.black color="black">Amount </TYPE.black>
                        <CustomNumericalInput
                          style={{
                            width: 'unset',
                            height: '60px'
                          }}
                          isInt={true}
                          placeholder="0"
                          value={buyAmount}
                          onUserInput={val => {
                            setBuyAmount(val)
                          }}
                        />
                      </AutoColumn>
                      <AutoColumn gap="8px" style={{ width: '100%' }}>
                        <TYPE.black color="black">Payment Currency </TYPE.black>
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
                      </AutoColumn>
                      <ButtonBlack onClick={toBuy} disabled={!Number(buyAmount)}>
                        Buy
                      </ButtonBlack>
                    </BuyPannel>
                  </div>

                  <div>
                    <MarketPrice>
                      <span>Market price per unit</span>
                      <span>{priceState === PriceState.VALID ? ethAmount.toSignificant(6) : '--'} ETH</span>
                    </MarketPrice>
                    <AutoColumn id="chart"></AutoColumn>
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
    </>
  )
}

function CreaterInfo({ info }: { info: NFTIndexInfoProps }) {
  return (
    <div>
      <RowFixed>
        <StyledAvatar>
          <img src="" alt="" />
        </StyledAvatar>
        <Paragraph header="Creator">{info.creatorName}</Paragraph>
      </RowFixed>
      <Hr />
      <Paragraph header="Creator wallet Address">{info.creator}</Paragraph>
      <Hr />
      <Paragraph header="Creator ID">#{info.creatorId}</Paragraph>
      <Hr />
      <Paragraph header="Bio">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </Paragraph>
    </div>
  )
}

function IndexInfo({ info }: { info: NFTIndexInfoProps }) {
  return (
    <div>
      <Paragraph header="Token contract address">0xKos369cd6vwd94wq1gt4hr87ujv</Paragraph>
      <Hr />
      {/* <Paragraph header="Current issuance">123</Paragraph>
      <Hr /> */}
      <Paragraph header="Description">{info.description}</Paragraph>
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
