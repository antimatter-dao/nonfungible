import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { TYPE } from 'theme'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import { TextValueInput } from 'components/TextInput'
import { ButtonBlack, ButtonDropdown, ButtonOutlined } from 'components/Button'
import NumericalInput from 'components/NumericalInput'
import NFTCard, { CardColor, NFTCardProps } from 'components/NFTCard'
import { ReactComponent as ETH } from 'assets/svg/eth_logo.svg'
import { SpotConfirmation } from './Confirmation'
import { AssetsParameter, CreateSpotData } from './index'
import { CurrencyNFTInputPanel } from 'components/CurrencyInputPanel'
// import { Currency } from '@uniswap/sdk'
import { WrappedTokenInfo } from 'state/lists/hooks'

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
  color: ${({ current }) => (current ? 'black' : 'rgba(0, 0, 0, 0.2)')};
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
`

const BackgroundItem = styled.div<{ selected?: boolean; color: CardColor }>`
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid ${({ selected }) => (selected ? '#000000' : 'rgba(0, 0, 0, 0.1)')};
  width: 76px;
  height: 76px;
  background: ${({ theme, color }) => theme[color]};
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

  const currentCard = useMemo((): NFTCardProps => {
    const _icons = data.assetsParameters.map((val, idx) => {
      console.log('🚀 ~ file: SpotIndex.tsx ~ line 168 ~ useEffect ~ val', val)
      return <ETH key={idx} />
    })
    return {
      id: '',
      name: data.name,
      indexId: '',
      color: data.color,
      address: '',
      icons: _icons,
      creator: 'Jack'
    }
  }, [data])

  const handleGenerate = useCallback(() => {
    setData('color', currentCard.color)
    setCurrent(++current)
  }, [current, setCurrent, setData, currentCard])

  return (
    <>
      {current === 1 && (
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

          <ButtonBlack
            height={60}
            onClick={() => setCurrent(++current)}
            disabled={!data.description.trim() || !data.name.trim()}
          >
            Next Step
          </ButtonBlack>
        </AutoColumn>
      )}

      {current === 2 && (
        <AutoColumn gap="40px">
          <CreationHeader current={current}>Index Parameter</CreationHeader>

          <AutoColumn gap="10px">
            {assetParams.map((item: AssetsParameter, index: number) => {
              return (
                <>
                  <CurrencyNFTInputPanel
                    hiddenLabel={true}
                    value={item.amount}
                    onUserInput={val => {
                      const newData = { ...item, amount: val }
                      handleParameterInput(index, newData)
                    }}
                    // onMax={handleMax}
                    currency={item.currencyToken}
                    // pair={dummyPair}
                    showMaxButton={false}
                    onCurrencySelect={currency => {
                      if (currency instanceof WrappedTokenInfo) {
                        const newData = { ...item, currency: currency.address, currencyToken: currency }
                        handleParameterInput(index, newData)
                      }
                    }}
                    label="Amount"
                    disableCurrencySelect={false}
                    id="stake-liquidity-token"
                    hideSelect={false}
                  />
                </>
              )
            })}
          </AutoColumn>

          <AutoColumn gap="12px">
            <ButtonOutlined height={60} onClick={addAsset} disabled={assetParams.length === 8}>
              + Add asset
            </ButtonOutlined>
            <ButtonBlack height={60} onClick={toColorStep} disabled={assetsBtnDIsabled}>
              Next Step
            </ButtonBlack>
          </AutoColumn>
        </AutoColumn>
      )}

      {current === 3 && (
        <AutoColumn gap="40px">
          <CreationHeader current={current}>NFT Cover Background</CreationHeader>
          <NFTCardPanel
            cardData={currentCard}
            setCardColor={(color: CardColor) => {
              setData('color', color)
            }}
          />
          <ButtonBlack height={60} onClick={handleGenerate}>
            Generate
          </ButtonBlack>
        </AutoColumn>
      )}

      {current === 4 && (
        <SpotConfirmation dataInfo={data}>
          <ButtonBlack onClick={onConfirm}>Confirm</ButtonBlack>
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
    <AutoRow justify="space-between" style={{ alignItems: 'flex-start' }}>
      <AutoColumn gap="12px" style={{ width: 264 }}>
        <TYPE.black>Select backgroud color</TYPE.black>
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
      <AutoColumn style={{ width: 200, height: 300 }} gap="12px">
        <TYPE.black fontSize={14}>Preview</TYPE.black>
        <StyledCard>
          <NFTCard {...cardData} />
        </StyledCard>
      </AutoColumn>
    </AutoRow>
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
