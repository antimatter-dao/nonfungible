import { AutoColumn } from 'components/Column'
import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { TYPE } from 'theme'
import { CreationHeader, CustomNumericalInput, NFTCardPanel, StyledCurrencyInputPanel } from './SpotIndex'
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
import { LockerConfirmation } from './Confirmation'
import { CurrencyNFTInputPanel } from 'components/CurrencyInputPanel'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { useCheckLockerSchedule, useCheckLockerContent } from 'state/creation/hooks'
import { X } from 'react-feather'
import { useCurrentUserInfo } from 'state/userInfo/hooks'
import CurrencyLogo from 'components/CurrencyLogo'
import { useAssetsTokens } from 'hooks/useIndexDetail'
import { ApprovalState, useMultiApproveCallback } from 'hooks/useMultiApproveCallback'
import { Currency, CurrencyAmount, JSBI, Token } from '@uniswap/sdk'
import { TokenInfo } from '@uniswap/token-lists'
import { LOCKER_721_ADDRESS } from 'constants/index'
import { useActiveWeb3React } from 'hooks'
import { tryParseAmount } from 'state/swap/hooks'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { Dots } from 'components/swap/styleds'

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

function LockerConfirm({
  onConfirm,
  selectAllTokens,
  selectCurrencyBalances,
  approvalStates,
  approveCallback
}: {
  onConfirm: () => void
  selectAllTokens: (CurrencyAmount | undefined)[]
  selectCurrencyBalances: (CurrencyAmount | undefined)[]
  approvalStates: ApprovalState[]
  approveCallback: (() => Promise<any>)[]
}): JSX.Element {
  const confirmButton: { text: string; disabled: boolean } = useMemo(() => {
    const ret: { text: string; disabled: boolean } = {
      text: 'Confirm',
      disabled: false
    }
    for (let index = 0; index < selectAllTokens.length; index++) {
      const currencyToken = selectAllTokens[index]
      const currencyBalances = selectCurrencyBalances[index]
      const approvalState = approvalStates[index]
      if (!currencyBalances || currencyBalances?.lessThan(currencyToken ?? JSBI.BigInt(0))) {
        ret.text = 'Insufficient balance'
        ret.disabled = true
        return ret
      }
      if (approvalState !== ApprovalState.APPROVED) {
        ret.text = 'Please to approve'
        ret.disabled = true
        return ret
      }
    }
    return ret
  }, [approvalStates, selectAllTokens, selectCurrencyBalances])

  const btnGroups: (JSX.Element | null)[] = useMemo(() => {
    return selectAllTokens.map((currencyToken, index) => {
      const currencyBalances = selectCurrencyBalances[index]
      const approvalState = approvalStates[index]
      const approve = approveCallback[index]

      if (!currencyBalances) {
        return (
          <ButtonBlack key={index} disabled>
            Insufficient balance
          </ButtonBlack>
        )
      }

      if (currencyBalances.lessThan(currencyToken ?? JSBI.BigInt(0))) {
        return (
          <ButtonBlack key={index} disabled>{`Insufficient ${currencyBalances.currency.symbol} balance`}</ButtonBlack>
        )
      }
      if (approvalState === ApprovalState.PENDING) {
        return (
          <ButtonBlack key={index} disabled>
            Allow Amitmatter to use your {currencyBalances.currency.symbol} <Dots />
          </ButtonBlack>
        )
      }
      if (approvalState !== ApprovalState.APPROVED) {
        return (
          <ButtonBlack key={index} onClick={approve}>
            Allow Amitmatter to use your {currencyBalances.currency.symbol}
          </ButtonBlack>
        )
      }

      return null
    })
  }, [approvalStates, approveCallback, selectAllTokens, selectCurrencyBalances])

  return (
    <AutoColumn gap="5px">
      {btnGroups.map(item => item)}
      {!confirmButton.disabled && (
        <ButtonBlack key={'a1'} onClick={onConfirm} height={60} disabled={confirmButton.disabled}>
          {confirmButton.text}
        </ButtonBlack>
      )}
    </AutoColumn>
  )
}

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
  const { chainId, account } = useActiveWeb3React()
  const userInfo = useCurrentUserInfo()
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

  const delAssetsItem = useCallback(
    index => {
      if (assetParams.length < 2) return
      const _assetParams = assetParams.filter((item, idx) => {
        return item && idx !== index
      })
      setAssetParams(_assetParams)
    },
    [assetParams, setAssetParams]
  )
  const disabledCurrencys = useMemo(
    () => assetParams.map(({ currencyToken }) => currencyToken as Currency).filter(item => item),
    [assetParams]
  )

  const assetsBtnDIsabled = useMemo(() => {
    return (
      assetParams.filter(val => {
        return val.amount.trim() && val.currency.trim() && Number(val.amount.trim())
      }).length < 1
    )
  }, [assetParams])

  const toColorStep = useCallback(() => {
    const _assetParams = assetParams
      .filter(val => {
        return val.amount.trim() && val.amount.trim() && Number(val.amount.trim())
      })
      .map(v => {
        return {
          currency: v.currency,
          currencyToken: v.currencyToken,
          amount: v.amount
        }
      })
    if (_assetParams.length < 1) return
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

  const selectAllTokens = useMemo(() => {
    return selectTokens.map(item => {
      return tryParseAmount(item.amount.toString(), item.currencyToken)
    })
  }, [selectTokens])
  const selectAllCurrencys = useMemo(() => {
    return selectTokens.map(item => {
      return item.currencyToken
    })
  }, [selectTokens])
  const { approvalStates, approveCalls } = useMultiApproveCallback(selectAllTokens, LOCKER_721_ADDRESS[chainId ?? 1])
  const approveCallback = approveCalls()

  const selectCurrencyBalances = useCurrencyBalances(account ?? undefined, selectAllCurrencys)

  return (
    <>
      {current === 1 && (
        <AutoColumn gap="40px">
          <CreationHeader title="Locker" indexArr={indexArr} current={current}>
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
              <FormControlLabel
                value={LockerType.ERC1155}
                control={<StyledRadio />}
                disabled
                label={LockerType.ERC1155}
              />
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
          <CreationHeader title="Locker" indexArr={indexArr} current={current}>
            Locker Assets
          </CreationHeader>

          <AutoColumn gap="10px">
            {assetParams.map((item: AssetsParameter, index: number) => {
              return (
                <StyledCurrencyInputPanel key={index} lessTwo={!!(assetParams.length < 2)}>
                  <CurrencyNFTInputPanel
                    hiddenLabel={false}
                    value={item.amount}
                    onUserInput={val => {
                      const newData = { ...item, amount: val }
                      handleParameterInput(index, newData)
                    }}
                    // onMax={handleMax}
                    currency={item.currencyToken}
                    disabledCurrencys={disabledCurrencys}
                    // pair={dummyPair}
                    showMaxButton={true}
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
                    disableCurrencySelect={false}
                    id={'stake-liquidity-token' + index}
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
          <CreationHeader title="Locker" indexArr={indexArr} current={current}>
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

          {schedule === TimeScheduleType.OneTIme && (
            <>
              <RowBetween>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <StyledDateBox>
                    <KeyboardDatePicker
                      disablePast
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
            <>
              <AutoColumn gap="5px">
                <TYPE.black fontSize="14px">Number of unlocks</TYPE.black>
                <CustomNumericalInput
                  style={{
                    width: 'unset',
                    height: '60px'
                  }}
                  maxLength={2}
                  isInt={true}
                  placeholder="2 times minimum"
                  value={data.unlockData.unlockNumbers}
                  onUserInput={val => {
                    const _data = { ...data.unlockData, unlockNumbers: val }
                    setData('unlockData', _data)
                  }}
                />
                <TYPE.gray fontSize="14px" color="text3">
                  2 times minimum
                </TYPE.gray>
              </AutoColumn>

              <AutoColumn gap="5px">
                <TYPE.black fontSize="14px">Unlock Interval</TYPE.black>
                <CustomNumericalInput
                  style={{
                    width: 'unset',
                    height: '60px'
                  }}
                  maxLength={4}
                  // isInt={true}
                  placeholder="Days"
                  value={data.unlockData.unlockInterval}
                  onUserInput={val => {
                    const _data = { ...data.unlockData, unlockInterval: val }
                    setData('unlockData', _data)
                  }}
                />
                <TYPE.gray fontSize="14px" color="text3">
                  Days
                </TYPE.gray>
              </AutoColumn>
            </>
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
          <CreationHeader title="Locker" current={current} indexArr={indexArr}>
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
        <LockerConfirmation dataInfo={data}>
          <LockerConfirm
            onConfirm={onConfirm}
            selectAllTokens={selectAllTokens}
            selectCurrencyBalances={selectCurrencyBalances}
            approvalStates={approvalStates}
            approveCallback={approveCallback}
          />
        </LockerConfirmation>
      )}
    </>
  )
}
