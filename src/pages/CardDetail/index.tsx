import { ButtonDropdown, ButtonEmpty, ButtonBlack, ButtonWhite } from 'components/Button'
import { RowBetween, RowFixed } from 'components/Row'
import { StyledTabItem, StyledTabs } from 'components/Tabs'
import React, { useEffect, useState } from 'react'

import { ChevronLeft } from 'react-feather'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Hr, Paragraph } from './Paragraph'
import { TYPE } from 'theme'
import NFTCard, { CardColor } from 'components/NFTCard'
import { ReactComponent as ETH } from 'assets/svg/eth_logo.svg'
import { AutoColumn, ColumnCenter } from 'components/Column'
import { createChart, IChartApi, ISeriesApi, LineStyle } from 'lightweight-charts'
import { getDexTradeList, DexTradeData } from 'utils/option/httpRequests'
// import { currencyId } from 'utils/currencyId'
import { useNetwork } from 'hooks/useNetwork'
import NumericalInput from 'components/NumericalInput'
import { useHistory } from 'react-router-dom'

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
  > img {
    background-color: #eee;
    width: 100%;
    height: 100%;
  }
`
const TokenButtonDropdown = styled(ButtonDropdown)`
  background: linear-gradient(0deg, #ffffff, #ffffff);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-weight: normal;
`

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

export interface Tokens {
  avatar: string
  symbol: string
  balance: string
}

let tokenList = [
  {
    avatar: 'string',
    symbol: 'string',
    balance: 'string'
  }
]
tokenList = [...tokenList, ...tokenList, ...tokenList, ...tokenList, ...tokenList, ...tokenList, ...tokenList]

const cardData = {
  id: '',
  name: 'Index Name',
  indexId: '2',
  color: CardColor.RED,
  address: '0xKos369cd6vwd94wq1gt4hr87ujv',
  icons: [<ETH key="1" />, <ETH key="2" />],
  creator: 'Jack'
}

export default function CardDetail() {
  const theme = useTheme()
  const history = useHistory()
  const [currentSubTab, setCurrentSubTab] = useState<SubTabType>(SubTabType.Creater)
  const [currentTab, setCurrentTab] = useState<TabType>(TabType.Information)
  const [currentTradeTab, setCurrentTradeTab] = useState<TradeTabType>(TradeTabType.Buy)
  const [value, setValue] = useState('')

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
            <NFTCard {...cardData} />
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
                <CreaterInfo />
              ) : currentSubTab === SubTabType.Index ? (
                <IndexInfo />
              ) : (
                <AssetsWrapper>
                  {tokenList.map(val => {
                    return <AssetItem {...val} key={val.symbol} />
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
                          value={value}
                          onUserInput={val => {
                            setValue(val)
                          }}
                        />
                      </AutoColumn>
                      <AutoColumn gap="8px" style={{ width: '100%' }}>
                        <TYPE.black color="black">Payment Currency </TYPE.black>
                        <TokenButtonDropdown>Select currency</TokenButtonDropdown>
                      </AutoColumn>
                      <ButtonBlack>Buy</ButtonBlack>
                    </BuyPannel>
                  </div>

                  <div>
                    <MarketPrice>
                      <span>Market price per unit</span>
                      <span>1234 USDT</span>
                    </MarketPrice>
                    <AutoColumn id="chart"></AutoColumn>
                  </div>
                </>
              </TradeWrapper>
            </InfoPanel>
          )}
        </RowBetween>
      </Wrapper>
    </>
  )
}

function CreaterInfo() {
  return (
    <div>
      <RowFixed>
        <StyledAvatar>
          <img src="" alt="" />
        </StyledAvatar>
        <Paragraph header="Creator wallet Address">0xKos369cd6vwd94wq1gt4hr87ujv</Paragraph>
      </RowFixed>
      <Hr />
      <Paragraph header="Creator wallet Address">0xKos369cd6vwd94wq1gt4hr87ujv</Paragraph>
      <Hr />
      <Paragraph header="Creator ID">#1234</Paragraph>
      <Hr />
      <Paragraph header="Bio">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </Paragraph>
    </div>
  )
}

function IndexInfo() {
  return (
    <div>
      <Paragraph header="Token contract address">0xKos369cd6vwd94wq1gt4hr87ujv</Paragraph>
      <Hr />
      <Paragraph header="Current issuance">123</Paragraph>
      <Hr />
      <Paragraph header="Description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </Paragraph>
    </div>
  )
}

function AssetItem({ avatar, symbol, balance }: Tokens) {
  return (
    <TokenWrapper>
      <RowFixed style={{ width: '100%' }}>
        <StyledAvatar wh="32px">
          <img src={avatar} alt="" />
        </StyledAvatar>
        <RowBetween>
          <TYPE.subHeader>{symbol}</TYPE.subHeader>
          <TYPE.black color={'black'} fontWeight={400}>
            {balance}
          </TYPE.black>
        </RowBetween>
      </RowFixed>
    </TokenWrapper>
  )
}
