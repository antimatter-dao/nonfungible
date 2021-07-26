import { AutoColumn } from 'components/Column'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { TYPE } from 'theme'
import {
  CreationHeader,
  CustomNumericalInput,
  InputRow,
  NFTCardPanel,
  StyledBalanceMax,
  TokenButtonDropdown
} from './SpotIndex'
import { StyledRadio, StyledRadioGroup, LockerType } from './index'
import TextInput from 'components/TextInput'
import { ButtonBlack, ButtonOutlined } from 'components/Button'
import { AutoRow, RowBetween } from 'components/Row'
import { FormControlLabel, RadioGroup } from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import styled from 'styled-components'
import { CardColor, NFTCardProps } from 'components/NFTCard'
import { ReactComponent as ETH } from 'assets/svg/eth_logo.svg'
import { LockerConfirmation } from './Confirmation'

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

enum TimeScheduleType {
  Flexible = 'Flexible (no lockup)',
  OneTIme = 'One Time Future Unlock',
  Shedule = 'Unlock with a shedule'
}

const indexArr = [1, 2, 3, 4]

const cardData = {
  id: '',
  name: 'Index Name',
  indexId: '2',
  color: CardColor.RED,
  address: '0xKos369cd6vwd94wq1gt4hr87ujv',
  icons: [<ETH key="1" />, <ETH key="2" />],
  creator: 'Jack'
}

export default function LockerIndex({
  current,
  setCurrent
}: {
  current: number
  setCurrent: Dispatch<SetStateAction<number>>
}) {
  const [currentLockerType, setCurrentLockerType] = useState<LockerType>(LockerType.ERC721)
  const handleCurrentLockerTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLockerType((event.target as HTMLInputElement).value as LockerType)
  }
  const [currentTimeSchedule, setCurrentTimeSchedule] = useState<TimeScheduleType>(TimeScheduleType.Flexible)
  const handleCurrentTimeScheduleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTimeSchedule((event.target as HTMLInputElement).value as TimeScheduleType)
  }

  const [currentCard, setCurrentCard] = useState<NFTCardProps>(cardData)
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date('2014-08-18T21:11:54'))

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
  }

  const [amountValue, setAmountValue] = useState('')

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
              value={currentLockerType}
              onChange={handleCurrentLockerTypeChange}
            >
              <FormControlLabel value={LockerType.ERC721} control={<StyledRadio />} label={LockerType.ERC721} />
              <FormControlLabel value={LockerType.ERC1155} control={<StyledRadio />} label={LockerType.ERC1155} />
            </StyledRadioGroup>
          </AutoColumn>

          {LockerType.ERC1155 === currentLockerType && (
            <TextInput label="NFT Copies" placeholder="Please enter how many copies to create" />
          )}

          <TextInput
            label="Locker Name"
            placeholder="Please enter the name of your index"
            hint="Maximum 20 characters"
          />

          <TextInput
            label="Message"
            placeholder="Please explain why this index is meaningful"
            hint="Maximum 100 characters"
          />

          <ButtonBlack height={60} onClick={() => setCurrent(++current)}>
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
            <AutoRow justify="space-between">
              <InputRow>
                <CustomNumericalInput
                  className="token-amount-input"
                  value={amountValue}
                  onUserInput={val => {
                    setAmountValue(val)
                  }}
                />
                <StyledBalanceMax>Max</StyledBalanceMax>
              </InputRow>
              <TokenButtonDropdown>Select currency</TokenButtonDropdown>
            </AutoRow>
            <AutoRow justify="space-between">
              <InputRow>
                <CustomNumericalInput
                  className="token-amount-input"
                  value={amountValue}
                  onUserInput={val => {
                    setAmountValue(val)
                  }}
                />
                <StyledBalanceMax>Max</StyledBalanceMax>
              </InputRow>
              <TokenButtonDropdown>Select currency</TokenButtonDropdown>
            </AutoRow>
          </AutoColumn>

          <AutoColumn gap="12px">
            <ButtonOutlined height={60}>+ Add asset</ButtonOutlined>
            <ButtonBlack height={60} onClick={() => setCurrent(++current)}>
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
              value={currentTimeSchedule}
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

          {currentTimeSchedule !== TimeScheduleType.Flexible && (
            <>
              <RowBetween>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <StyledDateBox>
                    <KeyboardDatePicker
                      margin="normal"
                      id="date-picker-dialog"
                      label="Unlock Date"
                      format="MM/dd/yyyy"
                      value={selectedDate}
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
                      value={selectedDate}
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

          {currentTimeSchedule === TimeScheduleType.Shedule && (
            <TextInput label="Unlock Percentage" placeholder="0%" hint="From 0% to 100%" />
          )}

          <ButtonBlack height={60} onClick={() => setCurrent(++current)}>
            Next Step
          </ButtonBlack>
        </AutoColumn>
      )}

      {current === 4 && (
        <AutoColumn gap="40px">
          <CreationHeader current={current} indexArr={indexArr}>
            NFT Cover Background
          </CreationHeader>
          <NFTCardPanel cardData={currentCard} setCardData={setCurrentCard} />
          <ButtonBlack height={60} onClick={() => setCurrent(++current)}>
            Generate
          </ButtonBlack>
        </AutoColumn>
      )}

      {current === 5 && <LockerConfirmation />}
    </>
  )
}
