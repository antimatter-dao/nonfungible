import { AutoColumn } from 'components/Column'
import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { TYPE } from 'theme'
import { CreationHeader, NFTCardPanel } from './SpotIndex'
import {
  StyledRadio,
  StyledRadioGroup,
  LockerType,
  TimeScheduleType,
  AssetsParameter,
  CreateLockerData,
  UnlockData
} from './index'
import { TextValueInput } from 'components/TextInput'
import { ButtonBlack, ButtonOutlined } from 'components/Button'
import { RowBetween } from 'components/Row'
import { FormControlLabel, RadioGroup } from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import styled from 'styled-components'
import { CardColor, NFTCardProps } from 'components/NFTCard'
import { ReactComponent as ETH } from 'assets/svg/eth_logo.svg'
import { LockerConfirmation } from './Confirmation'
import { CurrencyNFTInputPanel } from 'components/CurrencyInputPanel'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { useCheckLockerSchedule, useCheckLockerContent } from 'state/creation/hooks'

const StyledDateBox = styled.div`
  width: 260px;
  height: 60px;
  .MuiFormControl-root {
    margin: 0;
  }
  .MuiInputLabel-formControl {
    color: ${({ theme }) => theme.black};
    font-size: 16px;
  }
`

const StyledTimeBox = styled(StyledDateBox)`
  width: 224px;
`

const indexArr = [1, 2, 3, 4]

export default function LockerIndex({
  current,
  setCurrent,
  data,
  setData,
  onConfirm
}: {
  current: number
  setCurrent: Dispatch<SetStateAction<number>>
  data: CreateLockerData
  setData: (key: string, value: AssetsParameter[] | CardColor | string | UnlockData) => void
  onConfirm: () => void
}) {
  const { creationType, schedule } = data
  const isPassLockerSchedule = useCheckLockerSchedule(data)
  const isPassLockerContent = useCheckLockerContent(data)

  const handleCurrentLockerTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setData('creationType', (event.target as HTMLInputElement).value as LockerType)
    },
    [setData]
  )

  const handleCurrentTimeScheduleTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setData('schedule', (event.target as HTMLInputElement).value as TimeScheduleType)
    },
    [setData]
  )

  const handleDateChange = useCallback(
    (date: Date | null) => {
      const _data = { ...data.unlockData, datetime: date }
      setData('unlockData', _data)
    },
    [setData, data]
  )

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

  return (
    <>
      {current === 1 && (
        <AutoColumn gap="40px">
          <CreationHeader indexArr={indexArr} current={current}>
            Locker Content
          </CreationHeader>
          <AutoColumn>
            <TYPE.mediumHeader fontSize="14px">Select Creation Type</TYPE.mediumHeader>
            <StyledRadioGroup
              row
              aria-label="gender"
              name="gender1"
              value={creationType}
              onChange={handleCurrentLockerTypeChange}
            >
              <FormControlLabel value={LockerType.ERC721} control={<StyledRadio />} label={LockerType.ERC721} />
              <FormControlLabel value={LockerType.ERC1155} control={<StyledRadio />} label={LockerType.ERC1155} />
            </StyledRadioGroup>
          </AutoColumn>

          {LockerType.ERC1155 === creationType && (
            <TextValueInput
              label="NFT Copies"
              value={data.copies}
              onUserInput={val => {
                setData('copies', val)
              }}
              placeholder="Please enter how many copies to create"
            />
          )}

          <TextValueInput
            value={data.name}
            onUserInput={val => {
              setData('name', val)
            }}
            maxLength={20}
            label="Locker Name"
            placeholder="Please enter the name of your index"
            hint="Maximum 20 characters"
          />

          <TextValueInput
            value={data.message}
            onUserInput={val => {
              setData('message', val)
            }}
            maxLength={100}
            label="Message"
            placeholder="Please explain why this index is meaningful"
            hint="Maximum 100 characters"
          />

          <ButtonBlack height={60} disabled={!isPassLockerContent} onClick={() => setCurrent(++current)}>
            Next Step
          </ButtonBlack>
        </AutoColumn>
      )}

      {current === 2 && (
        <AutoColumn gap="40px">
          <CreationHeader indexArr={indexArr} current={current}>
            Locker Assetes
          </CreationHeader>

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
          <CreationHeader indexArr={indexArr} current={current}>
            Locker Time Schedule
          </CreationHeader>
          <AutoColumn gap="10px">
            <TYPE.mediumHeader>Select ?</TYPE.mediumHeader>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={schedule}
              onChange={handleCurrentTimeScheduleTypeChange}
            >
              <FormControlLabel
                value={TimeScheduleType.Flexible}
                control={<StyledRadio />}
                label={TimeScheduleType.Flexible}
              />
              <FormControlLabel
                value={TimeScheduleType.OneTIme}
                control={<StyledRadio />}
                label={TimeScheduleType.OneTIme}
              />
              <FormControlLabel
                value={TimeScheduleType.Shedule}
                control={<StyledRadio />}
                label={TimeScheduleType.Shedule}
              />
            </RadioGroup>
          </AutoColumn>

          {schedule !== TimeScheduleType.Flexible && (
            <>
              <RowBetween>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <StyledDateBox>
                    <KeyboardDatePicker
                      margin="normal"
                      id="date-picker-dialog"
                      label="Unlock Date"
                      format="MM/dd/yyyy"
                      value={data.unlockData.datetime}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                    />
                  </StyledDateBox>
                  <StyledTimeBox>
                    <KeyboardTimePicker
                      margin="normal"
                      id="time-picker"
                      label="Unlock Time"
                      value={data.unlockData.datetime}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change time'
                      }}
                    />
                  </StyledTimeBox>
                </MuiPickersUtilsProvider>
              </RowBetween>
            </>
          )}

          {schedule === TimeScheduleType.Shedule && (
            <TextValueInput
              value={data.unlockData.percentage}
              onUserInput={val => {
                setData('name', val)
              }}
              label="Unlock Percentage"
              placeholder="0%"
              hint="From 0% to 100%"
            />
          )}

          <ButtonBlack
            height={60}
            disabled={!isPassLockerSchedule}
            onClick={() => {
              setCurrent(++current)
            }}
          >
            Next Step
          </ButtonBlack>
        </AutoColumn>
      )}

      {current === 4 && (
        <AutoColumn gap="40px">
          <CreationHeader current={current} indexArr={indexArr}>
            NFT Cover Background
          </CreationHeader>
          <NFTCardPanel
            cardData={currentCard}
            setCardColor={(color: CardColor) => {
              setData('color', color)
            }}
          />
          <ButtonBlack height={60} onClick={() => setCurrent(++current)}>
            Generate
          </ButtonBlack>
        </AutoColumn>
      )}

      {current === 5 && (
        <LockerConfirmation>
          <ButtonBlack onClick={onConfirm}>Confirm</ButtonBlack>
        </LockerConfirmation>
      )}
    </>
  )
}
