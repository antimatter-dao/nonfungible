import React, { useCallback, useState } from 'react'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useToggleCreationModal } from 'state/application/hooks'
import styled from 'styled-components'
import IconClose, { IconBack } from 'components/Icons/IconClose'
import { ReactComponent as AlertCircle } from '../../assets/svg/alert_circle.svg'
import Modal from '../Modal'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import { RowFixed } from 'components/Row'
import { ButtonBlack } from 'components/Button'
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { RadioProps } from '@material-ui/core/Radio'
import clsx from 'clsx'
import SpotIndex from './SpotIndex'
import LockerIndex from './Locker'
import { CardColor } from 'components/NFTCard'
import TransactionConfirmationModal from '../TransactionConfirmationModal'
import { useIndexCreateCall } from '../../hooks/useIndexCreateCallback'
import { useWeb3React } from '@web3-react/core'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { tryParseAmount } from 'state/swap/hooks'

const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'f7f7f7'
    }
  },
  icon: {
    borderRadius: '50%',
    width: 28,
    height: 28,
    backgroundColor: '#ECECEC',
    '$root.Mui-focusVisible &': {
      outline: 'none'
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)'
    }
  },
  checkedIcon: {
    backgroundColor: '#ECECEC',
    position: 'relative',
    '&:before': {
      position: 'absolute',
      width: 16,
      height: 16,
      backgroundColor: '#000',
      borderRadius: '50%',
      top: 6,
      left: 6,
      content: '""'
    }
  }
})

export const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 50px;
  width: 600px;
  position: relative;
  background: ${({ theme }) => theme.text1};
  max-height: 100%;
  overflow-y: auto;
`

const StyledNoticeBox = styled(RowFixed)`
  background: #f7f7f7;
  height: 44px;
  width: 100%;
  padding: 10px 16px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 8px;

  > svg {
    margin-right: 10px;
  }
`
export const StyledRadioGroup = styled(RadioGroup)`
  &.MuiFormGroup-root {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
`

enum Step {
  Choose = 'Choose',
  SpotIndex = 'Spot Index',
  FutureIndex = 'Future Index',
  Locker = 'Locker'
}
export enum LockerType {
  ERC721 = 'ERC-721',
  ERC1155 = 'ERC-1155'
}
export enum TimeScheduleType {
  Flexible = 'Flexible (no lockup)',
  OneTIme = 'One Time Future Unlock',
  Shedule = 'Unlock with a shedule'
}

export interface UnlockData {
  datetime: Date | null
  percentage: string
}
export interface AssetsParameter {
  currency: string
  amount: string
  amountRaw?: string
  currencyToken?: WrappedTokenInfo
}
export interface CreateSpotData {
  name: string
  description: string
  assetsParameters: AssetsParameter[]
  color: CardColor
  creatorId: string
}

export interface CreateLockerData {
  creationType: LockerType
  name: string
  message: string
  copies: string
  schedule: TimeScheduleType
  unlockData: UnlockData
  assetsParameters: AssetsParameter[]
  color: CardColor
  creatorId: string
}

export const defaultSpotData: CreateSpotData = {
  name: '',
  description: '',
  assetsParameters: [
    {
      currency: '',
      amount: ''
    },
    {
      currency: '',
      amount: ''
    }
  ],
  color: CardColor.PURPLE,
  creatorId: '__'
}

export const defaultLockerData: CreateLockerData = {
  creationType: LockerType.ERC721,
  name: '',
  message: '',
  copies: '',
  assetsParameters: [
    {
      currency: '',
      amount: ''
    },
    {
      currency: '',
      amount: ''
    }
  ],
  schedule: TimeScheduleType.Flexible,
  unlockData: {
    datetime: null,
    percentage: ''
  },
  color: CardColor.PURPLE,
  creatorId: '-'
}

export default function CreationNFTModal() {
  const { account } = useWeb3React()
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

  const [createSpotData, setCreateSpotData] = useState<CreateSpotData>(defaultSpotData)
  const handleCreateSpotData = useCallback(
    (key: string, value: AssetsParameter[] | CardColor | string) => {
      if (!Object.keys(createSpotData).includes(key)) return
      setCreateSpotData({ ...createSpotData, [key]: value })
    },
    [setCreateSpotData, createSpotData]
  )

  const [createLockerData, setCreateLockerData] = useState<CreateLockerData>(defaultLockerData)
  const handleCreateLockerData = useCallback(
    (key: string, value: AssetsParameter[] | CardColor | string | UnlockData) => {
      if (!Object.keys(createLockerData).includes(key)) return
      setCreateLockerData({ ...createLockerData, [key]: value })
    },
    [setCreateLockerData, createLockerData]
  )

  const creationModalOpen = useModalOpen(ApplicationModal.Creation)
  const toggleCreationModal = useToggleCreationModal()
  const [currentCreation, setCurrentCreation] = useState<Step>(Step.SpotIndex)
  const handleCreationTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCreation((event.target as HTMLInputElement).value as Step)
  }
  const [currentStep, setCurrentStep] = useState<Step>(Step.Choose)
  const [currentStepIndexNumber, setCurrentStepIndexNumber] = useState<number>(0)

  const toCreateNext = useCallback(() => {
    setCurrentStep(currentCreation)
    setCurrentStepIndexNumber(1)
  }, [setCurrentStep, currentCreation, setCurrentStepIndexNumber])

  const handleBack = useCallback(() => {
    if (currentStepIndexNumber <= 1) {
      setCurrentStep(Step.Choose)
    }
    setCurrentStepIndexNumber(currentStepIndexNumber - 1)
  }, [currentStepIndexNumber, setCurrentStepIndexNumber, setCurrentStep])

  const spotCommitSuccessHandler = useCallback(() => {
    setCreateSpotData(defaultSpotData)
    setCurrentStep(Step.Choose)
    setCurrentStepIndexNumber(0)
    toggleCreationModal()
  }, [setCreateSpotData, setCurrentStep, setCurrentStepIndexNumber, toggleCreationModal])

  const { callback } = useIndexCreateCall()
  const createSpotConfirm = useCallback(() => {
    if (!callback || !account || !createSpotData) return
    const metadata = {
      // walletAddress: account,
      description: createSpotData.description,
      color: createSpotData.color
    }
    const address: string[] = createSpotData.assetsParameters.map(v => v.currency)
    const amounts: string[] = createSpotData.assetsParameters.map(v => {
      const ret = tryParseAmount(v.amount, v.currencyToken)?.raw.toString()
      return ret || ''
    })

    setTransactionModalOpen(true)
    setAttemptingTxn(true)
    callback(createSpotData.name, JSON.stringify(metadata), address, amounts)
      .then(hash => {
        setAttemptingTxn(false)
        setHash(hash)
        spotCommitSuccessHandler()
      })
      .catch(err => {
        // setTransactionModalOpen(false)
        setAttemptingTxn(false)
        setError(true)
        setErrorMsg(err?.message)
        console.error('spo commit err', err)
      })
  }, [createSpotData, callback, account, spotCommitSuccessHandler, setAttemptingTxn, setTransactionModalOpen])

  const createLockerConfirm = useCallback(() => {
    alert('createLockerConfirm')
  }, [])

  return (
    <>
      <Modal
        isOpen={creationModalOpen}
        onDismiss={toggleCreationModal}
        minHeight={30}
        maxHeight={85}
        width="600px"
        maxWidth={600}
        zIndex={5}
      >
        <Wrapper>
          {currentStep !== Step.Choose && <IconBack onEvent={handleBack} style={{ top: 28, left: 28 }} />}
          <IconClose onEvent={toggleCreationModal} style={{ top: 28, right: 28 }} />

          {currentStep === Step.Choose && (
            <AutoColumn gap="40px">
              <AutoColumn gap="16px">
                <TYPE.largeHeader fontSize={30} color="black">
                  Create your financial NFT
                </TYPE.largeHeader>
                <StyledNoticeBox>
                  <AlertCircle />
                  <TYPE.body fontSize={14} color="black">
                    Please read docs about non-fungible finance before creating.
                  </TYPE.body>
                </StyledNoticeBox>
              </AutoColumn>
              <AutoColumn gap="20px">
                <TYPE.subHeader fontSize={16}>Select Creation Type</TYPE.subHeader>
                <StyledRadioGroup
                  row
                  aria-label="gender"
                  name="gender1"
                  value={currentCreation}
                  onChange={handleCreationTypeChange}
                >
                  <FormControlLabel value={Step.SpotIndex} control={<StyledRadio />} label={Step.SpotIndex} />
                  <FormControlLabel value={Step.FutureIndex} control={<StyledRadio />} label={Step.FutureIndex} />
                  <FormControlLabel value={Step.Locker} control={<StyledRadio />} label={Step.Locker} />
                </StyledRadioGroup>
              </AutoColumn>
              <ButtonBlack
                height={60}
                style={{ marginTop: 20 }}
                onClick={toCreateNext}
                disabled={currentCreation !== Step.SpotIndex}
              >
                {currentCreation === Step.SpotIndex ? 'Confirm' : 'Comming soon'}
              </ButtonBlack>
            </AutoColumn>
          )}

          {currentStep === Step.SpotIndex && (
            <SpotIndex
              current={currentStepIndexNumber}
              setCurrent={setCurrentStepIndexNumber}
              setData={handleCreateSpotData}
              data={createSpotData}
              onConfirm={createSpotConfirm}
            />
          )}
          {currentStep === Step.Locker && (
            <LockerIndex
              current={currentStepIndexNumber}
              setCurrent={setCurrentStepIndexNumber}
              setData={handleCreateLockerData}
              data={createLockerData}
              onConfirm={createLockerConfirm}
            />
          )}
        </Wrapper>
      </Modal>

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

export function StyledRadio(props: RadioProps) {
  const classes = useStyles()

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  )
}
