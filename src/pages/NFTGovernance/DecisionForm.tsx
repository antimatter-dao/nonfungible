import React, { useState, useCallback, useMemo } from 'react'
import { X } from 'react-feather'
import { JSBI, CurrencyAmount } from '@uniswap/sdk'
import styled from 'styled-components'
import { ButtonEmpty, ButtonOutlinedPrimary, ButtonPrimary } from 'components/Button'
import { LightGreyCard } from 'components/Card'
import { RowBetween } from 'components/Row'
import { getDeltaTime, Timer } from 'components/Timer'
import { Dots } from 'components/swap/styleds'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import { SubmittedView } from 'components/ModalViews'
import Modal from 'components/Modal'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { TYPE } from 'theme'
import { AutoColumn } from 'components/Column'
import { Users, GovernanceContent } from '../../hooks/useGovernanceDetail'
import { TimerCapsule } from 'components/NFTCard/Capsule'
import { GOVERNANCE_ADDRESS, GOVERNANCE_TOKEN, FACTORY_CHAIN_ID } from '../../constants'
import { StatusOption, VoteOption, ConfirmType, toNumber } from './NFTGovernanceDetail'
import { CardColor } from 'components/NFTCard'
import useTheme from 'hooks/useTheme'

const VoteOptionCard = styled.div<{ selected?: boolean }>`
  border-radius: 14px;
  border: 1px solid ${({ theme, selected }) => (selected ? theme.primary1 : 'transparent')};
  background-color: ${({ theme }) => theme.translucent};
  width: 160px;
  height: 52px;
  display: flex;
  font-size: 14px;
  color: ${({ theme, selected }) => (selected ? theme.text1 : theme.text3)};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > div {
    margin-top: 1px;
  }
  :hover {
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
`}
`

const VoteOptionWrapper = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  & > * {
    margin-top: 12px;
  };
  & > *:first-child {
    margin-top: 0;
  }
`}
`

const ModalButtonWrapper = styled(RowBetween)`
  margin-top: 14px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  & > *:last-child {
    margin-top: 12px;
  };
  & > *:first-child {
    margin: 0;
  }
`}
`

export function DecisionForm({
  timeLeft,
  status,
  userStaking,
  chainId,
  contents,
  onVote,
  onClaim,
  txHash,
  attemptingTxn,
  enoughBalance,
  selected,
  onSelect,
  inputValue,
  voteValue,
  onInput,
  onMax
}: {
  timeLeft: string
  status: StatusOption | undefined
  userStaking: Users
  chainId: number | undefined
  contents: GovernanceContent | undefined
  enoughBalance: boolean | undefined
  attemptingTxn: boolean
  txHash: string
  selected: VoteOption
  voteValue: string
  inputValue: CurrencyAmount | undefined
  onSelect: (option: VoteOption) => () => void
  onInput: (val: string) => void
  onMax: () => void
  onVote: () => void
  onClaim: () => void
}) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [NeutralSubmitted, setNeutralSubmitted] = useState(false)
  const [submitType, setSubmitType] = useState(ConfirmType.Vote)

  const [approval, approveCallback] = useApproveCallback(inputValue, GOVERNANCE_ADDRESS)

  const handleClaimSubmit = useCallback(() => {
    setSubmitType(ConfirmType.Claim)
    setShowConfirm(true)
  }, [])

  const handleNeutralDismiss = useCallback(() => {
    setNeutralSubmitted(false)
  }, [])

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
  }, [])

  const handleConfirmConfirmation = useCallback(() => {
    onVote()
  }, [onVote])

  const handleSubmit = useCallback(() => {
    setSubmitType(ConfirmType.Vote)
    setShowConfirm(true)
  }, [])

  const claimBtn = useMemo(() => {
    const ret = {
      text: <>Claim</>,
      disable: true,
      event: handleClaimSubmit
    }

    if (!chainId) {
      ret.text = <>Connect wallet</>
      ret.disable = true
      return ret
    }
    if (chainId !== FACTORY_CHAIN_ID) {
      ret.text = <>Please switch to ETH chain</>
      ret.disable = true
      return ret
    }

    if (!JSBI.greaterThan(JSBI.BigInt(userStaking.totalStake), JSBI.BigInt(0))) {
      ret.disable = true
      return ret
    }

    if (getDeltaTime(userStaking.stakeEndTime)) {
      ret.text = (
        <>
          <Timer timer={+userStaking.stakeEndTime} onZero={() => {}} />
          {' can claim'}
        </>
      )
      ret.disable = true
      return ret
    }

    ret.disable = false
    return ret
  }, [userStaking, chainId, handleClaimSubmit])

  const btnStatus = useMemo(() => {
    const ret = {
      text: <>submit</>,
      event: () => {},
      disable: false
    }
    if (status === StatusOption.Failed || status === StatusOption.Success) {
      ret.text = <>Voting has ended</>
      ret.disable = true
      return ret
    }
    if (!chainId) {
      ret.text = <>Connect wallet</>
      ret.disable = true
      return ret
    }
    if (chainId !== FACTORY_CHAIN_ID) {
      ret.text = <>Please switch to ETH chain</>
      ret.disable = true
      return ret
    }

    if (!inputValue || (inputValue && !inputValue.greaterThan(JSBI.BigInt(0)))) {
      ret.text = <>Please input amount</>
      ret.disable = true
      return ret
    }

    if (!enoughBalance) {
      ret.text = <>Insufficient Balance</>
      ret.disable = true
      return ret
    }

    if (approval !== ApprovalState.APPROVED) {
      ret.event = approveCallback
      ret.text =
        approval === ApprovalState.PENDING ? (
          <>
            Allow Amitmatter to use your Matter<Dots>Loading</Dots>
          </>
        ) : (
          <>Allow Amitmatter to use your Matter</>
        )
      ret.disable = !!(approval === ApprovalState.PENDING)
      return ret
    }

    ret.text = <>submit</>
    ret.event = handleSubmit
    ret.disable = false
    return ret
  }, [inputValue, enoughBalance, status, approval, handleSubmit, approveCallback, chainId])

  return (
    <>
      <LightGreyCard>
        <AutoColumn gap="24px" style={{ maxWidth: 468, margin: '4px auto' }} justify="center">
          <TYPE.black fontSize={28} textAlign="center">
            Make Your Decision
          </TYPE.black>
          <TimerCapsule color={CardColor.RED} timeLeft={+timeLeft} />
          <VoteOptionWrapper style={{ padding: '0 20px', marginBottom: -15, fontSize: 12 }}>
            <span>My votes: {toNumber(userStaking.totalYes)}</span>
            <span>My votes: {toNumber(userStaking.totalNo)}</span>
          </VoteOptionWrapper>
          <VoteOptionWrapper style={{ padding: '0 20px' }}>
            <VoteOptionCard selected={selected === VoteOption.FOR} onClick={onSelect(VoteOption.FOR)}>
              Vote For
              {status === StatusOption.Live && selected === VoteOption.FOR && (
                <TYPE.small>{inputValue ? inputValue.toFixed(4) : '-'} MATTER</TYPE.small>
              )}
            </VoteOptionCard>
            <VoteOptionCard selected={selected === VoteOption.AGAINST} onClick={onSelect(VoteOption.AGAINST)}>
              Vote Against
              {status === StatusOption.Live && selected === VoteOption.AGAINST && (
                <TYPE.small>{inputValue ? inputValue.toFixed(4) : '-'} MATTER</TYPE.small>
              )}
            </VoteOptionCard>
          </VoteOptionWrapper>
          {status === StatusOption.Live && (
            <div style={{ width: 'calc(100% - 40px)' }}>
              <CurrencyInputPanel
                value={voteValue}
                onUserInput={onInput}
                onMax={onMax}
                showMaxButton={true}
                currency={GOVERNANCE_TOKEN}
                // pair={dummyPair}
                label="Amount"
                disableCurrencySelect={true}
                customBalanceText={'Balance: '}
                id="stake-vote-token"
                hideSelect={true}
              />
            </div>
          )}
          <TYPE.smallGray textAlign="center" style={{ color: '#f6f6f6' }}>
            {selected === VoteOption.FOR ? contents?.agreeFor : contents?.againstFor}
          </TYPE.smallGray>
          {status === StatusOption.Live ? (
            <ButtonPrimary width="436px" onClick={btnStatus.event} disabled={btnStatus.disable} padding="20px">
              {btnStatus.text}
            </ButtonPrimary>
          ) : (
            <ButtonPrimary width="436px" onClick={claimBtn.event} disabled={claimBtn.disable} padding="20px">
              {claimBtn.text}
            </ButtonPrimary>
          )}
        </AutoColumn>
      </LightGreyCard>
      <Modal isOpen={NeutralSubmitted} onDismiss={handleNeutralDismiss}>
        <SubmittedModalContent submitType={submitType} onDismiss={handleNeutralDismiss} hash={txHash} />
      </Modal>
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash}
        content={() =>
          ConfirmType.Vote === submitType ? (
            <ConfirmationModalContent
              voteValue={inputValue?.toFixed(4) ?? ''}
              voteOption={selected}
              onDismiss={handleDismissConfirmation}
              onConfirm={handleConfirmConfirmation}
            />
          ) : (
            <ConfirmationClaimModalContent
              totalStaking={toNumber(userStaking.totalStake)}
              onDismiss={handleDismissConfirmation}
              onConfirm={onClaim}
            />
          )
        }
        pendingText={'Waiting For Confirmation...'}
        submittedContent={() => (
          <SubmittedModalContent submitType={submitType} onDismiss={handleDismissConfirmation} hash={txHash} />
        )}
      />
    </>
  )
}

function ConfirmationModalContent({
  voteOption,
  onDismiss,
  voteValue,
  onConfirm
}: {
  voteOption: VoteOption
  voteValue: string | number
  onDismiss: () => void
  onConfirm: () => void
}) {
  const theme = useTheme()
  return (
    <AutoColumn justify="center" style={{ padding: 24, width: '100%' }} gap="20px">
      <RowBetween>
        <div style={{ width: 24 }} />
        <TYPE.body fontSize={18}>{voteOption === VoteOption.FOR ? 'Vote For' : 'Vote Against'}</TYPE.body>
        <ButtonEmpty width="auto" padding="0" onClick={onDismiss}>
          <X color={theme.text3} size={24} />
        </ButtonEmpty>
      </RowBetween>

      <TYPE.largeHeader fontSize={28} fontWeight={300}>
        {voteValue} MATTER
      </TYPE.largeHeader>
      <TYPE.body fontSize={14}>
        Are you sure you want to vote {voteOption === VoteOption.FOR ? 'For' : 'Against'}?
      </TYPE.body>
      <ModalButtonWrapper>
        <ButtonOutlinedPrimary marginRight="15px" onClick={onDismiss}>
          Cancel
        </ButtonOutlinedPrimary>
        <ButtonPrimary onClick={onConfirm}>Confirm</ButtonPrimary>
      </ModalButtonWrapper>
    </AutoColumn>
  )
}

function ConfirmationClaimModalContent({
  totalStaking,
  onDismiss,
  onConfirm
}: {
  totalStaking: string | number
  onDismiss: () => void
  onConfirm: () => void
}) {
  const theme = useTheme()
  return (
    <AutoColumn justify="center" style={{ padding: 24, width: '100%' }} gap="20px">
      <RowBetween>
        <div style={{ width: 24 }} />
        <TYPE.body fontSize={18}>Claim</TYPE.body>
        <ButtonEmpty width="auto" padding="0" onClick={onDismiss}>
          <X color={theme.text3} size={24} />
        </ButtonEmpty>
      </RowBetween>

      <TYPE.largeHeader fontSize={28} fontWeight={300}>
        {totalStaking} MATTER
      </TYPE.largeHeader>
      <TYPE.body fontSize={14}>Are you sure you want to claim?</TYPE.body>
      <ModalButtonWrapper>
        <ButtonOutlinedPrimary marginRight="15px" onClick={onDismiss}>
          Cancel
        </ButtonOutlinedPrimary>
        <ButtonPrimary onClick={onConfirm}>Confirm</ButtonPrimary>
      </ModalButtonWrapper>
    </AutoColumn>
  )
}

function SubmittedModalContent({
  submitType,
  onDismiss,
  hash,
  isError
}: {
  submitType: ConfirmType
  onDismiss: () => void
  hash: string | undefined
  isError?: boolean
}) {
  const notice =
    submitType === ConfirmType.Vote
      ? {
          error: (
            <>
              Oops! Your balance is not <br /> enought to vote against
            </>
          ),
          success: (
            <>
              Your vote against
              <br /> Is accepted successfully
            </>
          )
        }
      : {
          error: <>Oops! Claim transaction failed.</>,
          success: <>Claim Transaction submitted successfully.</>
        }

  return (
    <>
      <SubmittedView onDismiss={onDismiss} hash={hash} hideLink isError={isError}>
        <TYPE.body fontWeight={400} fontSize={18} textAlign="center">
          {isError ? notice.error : notice.success}
        </TYPE.body>
      </SubmittedView>
    </>
  )
}
