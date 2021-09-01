import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { HideSmall, ShowSmall, TYPE } from 'theme'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import { TextValueInput } from 'components/TextInput'
import {
  ButtonBlack as ButtonBlackDesktop,
  ButtonDropdown,
  ButtonOutlined as ButtonOutlinedDesktop
} from 'components/Button'
import NumericalInput from 'components/NumericalInput'
import NFTCard, { CardColor, NFTCardProps } from 'components/NFTCard'
import { SpotConfirmation } from './Confirmation'
import { AssetsParameter, CreateSpotData } from './index'
import { CurrencyNFTInputPanel } from 'components/CurrencyInputPanel'
// import { Currency } from '@uniswap/sdk'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { useAssetsTokens } from 'hooks/useIndexDetail'
import CurrencyLogo from 'components/CurrencyLogo'
import { Currency, Token } from '@uniswap/sdk'
import { useCurrentUserInfo } from 'state/userInfo/hooks'
import { X } from 'react-feather'
import { useNFTETHPrice } from 'data/Reserves'
import { TokenAmount } from '@uniswap/sdk'
import { useCheckSpotCreateButton } from 'hooks/useIndexCreateCallback'
import { TokenInfo } from '@uniswap/token-lists'

export const StyledCurrencyInputPanel = styled.div<{ lessTwo: boolean }>`
  padding-right: ${({ lessTwo }) => (lessTwo ? '0' : '40px')};
  position: relative;
  .del-input {
    display: ${({ lessTwo }) => (lessTwo ? 'none' : 'black')};
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
`

export const IndexIcon = styled.div<{ current?: boolean }>`
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 32px;
  height: 32px;
  font-weight: 500;
  font-size: 16px;
  line-height: 32px;
  text-align: center;
  text-transform: capitalize;
  border-radius: 50%;
  margin-left: 16px;
  flex-shrink: 0;
  color: ${({ current }) => (current ? 'black' : 'rgba(0, 0, 0, 0.2)')};
  ${({ theme, current }) => theme.mediaWidth.upToSmall`
    width: 28px;
    height: 28px;
    line-height: 28px;
    color: ${current ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'};
    border-color: rgba(255, 255, 255, 0.2);
  `}
`
export const InputRow = styled.div<{ disabled?: boolean }>`
  align-items: center;
  border-radius: 14px;
  position: relative;
  ${({ theme }) => theme.flexRowNoWrap}
`

export const CustomNumericalInput = styled(NumericalInput)`
  background: transparent;
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px 150px 20px 20px;
  width: 280px;
  height: 60px;
  color: ${({ theme }) => theme.black};
`
export const StyledBalanceMax = styled.button`
  position: absolute;
  right: 20px;
  top: 10px;
  height: 40px;
  border: 1px solid transparent;
  border-radius: 49px;
  font-size: 0.875rem;
  padding: 0 1rem;
  width: 120px;
  background: rgba(0, 0, 0, 0.1);
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.black};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

export const TokenButtonDropdown = styled(ButtonDropdown)`
  background: linear-gradient(0deg, #ffffff, #ffffff);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-weight: normal;
  width: 208px;
  height: 60px;
`
const StyledCard = styled.div`
  transform-origin: 0 0;
  transform: scale(0.715);
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  transform: unset;
  `}
`

const BackgroundItem = styled.div<{ selected?: boolean; color: CardColor }>`
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid ${({ selected }) => (selected ? '#000000' : 'rgba(0, 0, 0, 0.1)')};
  width: 76px;
  height: 76px;
  background: ${({ theme, color }) => theme[color]};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 56px;
  height: 56px;`}
`

const ButtonBlack = styled(ButtonBlackDesktop)`
  margin-top: 40px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-top: auto;
  background-color: ${({ theme }) => theme.primary1};
  color: #000000;
  :hover{
    background: ${({ theme }) => theme.primary4};
  }
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    :disabled {
      color: ${({ theme }) => theme.text3};
      background: ${({ theme }) => theme.bg4};
    }
  `}
`

const ButtonOutlined = styled(ButtonOutlinedDesktop)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    border-color: ${({ theme }) => theme.primary1};
    color: ${({ theme }) => theme.primary1};
  `}
`

const CardPanelWrapper = styled(AutoRow)`
  align-items: flex-start;
  > div:first-child {
    width: 264px;
  }
  > div:last-child {
    width: 200px;
    height: 300px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-content: center;
    > div:first-child, > div:last-child{
      width: 100%;
      height: auto;
    }
  `}
`

const ButtonGroup = styled(AutoColumn)`
  margin-top: 40px;
  > button:last-child {
    margin-top: 0;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: auto;
  `}
`

export default function SpotIndex({
  current,
  setCurrent,
  data,
  setData,
  onConfirm
}: {
  current: number
  setCurrent: Dispatch<SetStateAction<number>>
  data: CreateSpotData
  setData: (key: string, value: AssetsParameter[] | CardColor | string) => void
  onConfirm: () => void
}) {
  const [assetParams, setAssetParams] = useState<AssetsParameter[]>(data.assetsParameters)
  const userInfo = useCurrentUserInfo()

  const handleParameterInput = useCallback(
    (index: number, value: AssetsParameter) => {
      if (!assetParams[index]) return
      const retParam = assetParams.map((item, idx) => {
        if (idx === index) {
          return value
        }
        return item
      })

      setAssetParams(retParam)
    },
    [setAssetParams, assetParams]
  )

  const addAsset = useCallback(() => {
    if (assetParams.length >= 8) return
    setAssetParams([...assetParams, { amount: '', currency: '' }])
  }, [assetParams, setAssetParams])

  const delAssetsItem = useCallback(
    index => {
      if (assetParams.length < 3) return
      const _assetParams = assetParams.filter((item, idx) => {
        return item && idx !== index
      })
      setAssetParams(_assetParams)
    },
    [assetParams, setAssetParams]
  )

  const assetsBtnDIsabled = useMemo(() => {
    return (
      assetParams.filter(val => {
        return val.amount.trim() && val.currency.trim()
      }).length < 2
    )
  }, [assetParams])

  const toColorStep = useCallback(() => {
    const _assetParams = assetParams
      .filter(val => {
        return val.amount.trim() && val.amount.trim()
      })
      .map(v => {
        return {
          currency: v.currency,
          currencyToken: v.currencyToken,
          amount: v.amount
        }
      })
    if (_assetParams.length < 2) return
    setData('assetsParameters', _assetParams)
    setCurrent(++current)
  }, [current, setCurrent, assetParams, setData])

  const selectTokens = useAssetsTokens(data.assetsParameters)

  const currentCard = useMemo((): NFTCardProps => {
    const _icons = selectTokens.map((val, idx) => {
      return <CurrencyLogo currency={val.currencyToken} key={idx} />
    })
    return {
      id: '',
      name: data.name,
      indexId: data.creatorId,
      color: data.color,
      address: '',
      icons: _icons,
      creator: userInfo ? userInfo.username : ''
    }
  }, [data, selectTokens, userInfo])

  const handleGenerate = useCallback(() => {
    setData('color', currentCard.color)
    setCurrent(++current)
  }, [current, setCurrent, setData, currentCard])

  const disabledCurrencys = useMemo(
    () => assetParams.map(({ currencyToken }) => currencyToken as Currency).filter(item => item),
    [assetParams]
  )

  const { eths } = useNFTETHPrice(data.assetsParameters)
  const tokenFluiditys: (TokenAmount | null)[] = useMemo(() => {
    return eths.map(val => val[3])
  }, [eths])

  const spotCreateButton = useCheckSpotCreateButton(tokenFluiditys)

  return (
    <>
      {current === 1 && (
        <>
          <AutoColumn gap="40px">
            <CreationHeader current={current}>Index Content</CreationHeader>

            <TextValueInput
              value={data.name}
              onUserInput={val => {
                setData('name', val)
              }}
              maxLength={20}
              label="Index Name"
              placeholder="Please enter the name of your index"
              hint="Maximum 20 characters"
            />

            <TextValueInput
              value={data.description}
              onUserInput={val => {
                setData('description', val)
              }}
              maxLength={100}
              label="Description"
              placeholder="Please explain why this index is meaningful"
              hint="Maximum 100 characters"
            />
          </AutoColumn>
          <ButtonBlack
            height={60}
            onClick={() => setCurrent(++current)}
            disabled={!data.description.trim() || !data.name.trim()}
          >
            Next Step
          </ButtonBlack>
        </>
      )}

      {current === 2 && (
        <>
          <AutoColumn gap="40px">
            <CreationHeader current={current}>Index Parameter</CreationHeader>
            <AutoColumn gap="10px">
              <RowBetween>
                <HideSmall>
                  <TYPE.black fontSize={14} fontWeight={500}>
                    Underlying asset
                  </TYPE.black>
                </HideSmall>
                <ShowSmall>
                  <TYPE.body fontSize={14} fontWeight={500}>
                    Underlying asset
                  </TYPE.body>
                </ShowSmall>
                <TYPE.darkGray fontSize={14} fontWeight={400}>
                  Maximum 8 assets
                </TYPE.darkGray>
              </RowBetween>

              {assetParams.map((item: AssetsParameter, index: number) => {
                return (
                  <StyledCurrencyInputPanel key={index} lessTwo={!!(assetParams.length < 3)}>
                    <CurrencyNFTInputPanel
                      hiddenLabel={true}
                      value={item.amount}
                      onUserInput={val => {
                        const newData = { ...item, amount: val }
                        handleParameterInput(index, newData)
                      }}
                      disabledCurrencys={disabledCurrencys}
                      // onMax={handleMax}
                      currency={item.currencyToken}
                      // pair={dummyPair}
                      showMaxButton={false}
                      onCurrencySelect={currency => {
                        if (currency instanceof WrappedTokenInfo) {
                          const newData = { ...item, currency: currency.address, currencyToken: currency }
                          handleParameterInput(index, newData)
                        } else if (currency instanceof Token) {
                          const tokenInfo: TokenInfo = {
                            chainId: currency.chainId,
                            address: currency.address,
                            name: currency.name ?? '',
                            decimals: currency.decimals,
                            symbol: currency.symbol ?? ''
                          }
                          const _currency = new WrappedTokenInfo(tokenInfo, [])
                          const newData = { ...item, currency: currency.address, currencyToken: _currency }
                          handleParameterInput(index, newData)
                        }
                      }}
                      label="Amount"
                      disableCurrencySelect={false}
                      id="stake-liquidity-token"
                      hideSelect={false}
                    />
                    <X
                      className="del-input"
                      onClick={() => {
                        delAssetsItem(index)
                      }}
                    />
                  </StyledCurrencyInputPanel>
                )
              })}
            </AutoColumn>
          </AutoColumn>
          <ButtonGroup gap="12px">
            <ButtonOutlined height={60} onClick={addAsset} disabled={assetParams.length === 8}>
              + Add asset
            </ButtonOutlined>
            <ButtonBlack height={60} onClick={toColorStep} disabled={assetsBtnDIsabled}>
              Next Step
            </ButtonBlack>
          </ButtonGroup>
        </>
      )}

      {current === 3 && (
        <>
          <AutoColumn gap="40px">
            <CreationHeader current={current}>NFT Cover Background</CreationHeader>
            <NFTCardPanel
              cardData={currentCard}
              setCardColor={(color: CardColor) => {
                setData('color', color)
              }}
            />
          </AutoColumn>
          <ButtonBlack height={60} onClick={handleGenerate}>
            Generate
          </ButtonBlack>
        </>
      )}

      {current === 4 && (
        <SpotConfirmation dataInfo={data} tokenFluiditys={tokenFluiditys}>
          <ButtonBlack onClick={onConfirm} disabled={spotCreateButton.disabled} height={60}>
            {spotCreateButton.text}
          </ButtonBlack>
        </SpotConfirmation>
      )}
    </>
  )
}

export function NFTCardPanel({
  cardData,
  setCardColor
}: {
  cardData: NFTCardProps
  setCardColor: (color: CardColor) => void
}) {
  return (
    <CardPanelWrapper justify="space-between">
      <AutoColumn gap="12px">
        <HideSmall>
          <TYPE.black fontSize={14}>Select background color</TYPE.black>
        </HideSmall>
        <ShowSmall>
          <TYPE.darkGray fontSize={14}>Select backgroud color</TYPE.darkGray>
        </ShowSmall>
        <AutoRow gap="6px">
          {Object.values(CardColor).map(color => (
            <BackgroundItem
              key={color}
              selected={cardData.color === color}
              color={color}
              onClick={() => setCardColor(color)}
            />
          ))}
        </AutoRow>
      </AutoColumn>
      <AutoColumn gap="12px">
        <HideSmall>
          <TYPE.black fontSize={14} style={{ maxWidth: 100 }}>
            Preview
          </TYPE.black>
        </HideSmall>
        <ShowSmall>
          <TYPE.darkGray fontSize={14} style={{ maxWidth: 100, marginTop: 24 }}>
            Preview
          </TYPE.darkGray>
        </ShowSmall>
        <StyledCard>
          <NFTCard createName="Locker ID" noBorderArea={true} {...cardData} />
        </StyledCard>
      </AutoColumn>
    </CardPanelWrapper>
  )
}

export function CreationHeader({
  title = 'Spot Index',
  current,
  children,
  indexArr = [1, 2, 3]
}: {
  title?: string
  current?: number
  children: React.ReactNode
  indexArr?: number[]
}) {
  return (
    <div>
      <TYPE.smallGray fontSize="12px">{title}</TYPE.smallGray>
      <RowBetween>
        <TYPE.mediumHeader fontSize="30px">{children}</TYPE.mediumHeader>
        <RowFixed>
          <IndexIconGroup indexArr={indexArr} current={current} />
        </RowFixed>
      </RowBetween>
    </div>
  )
}

function IndexIconGroup({ current, indexArr = [1, 2, 3] }: { current?: number; indexArr?: number[] }) {
  return (
    <>
      {indexArr.map(v => (
        <IndexIcon current={current === v} key={v}>
          {v}
        </IndexIcon>
      ))}
    </>
  )
}
