import React, { useState, useCallback, useMemo } from 'react'
import { JSBI, TokenAmount } from '@uniswap/sdk'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { RowBetween, RowFixed } from 'components/Row'
import useTheme from 'hooks/useTheme'
import { ButtonEmpty } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import ProgressBar from 'components/NFTCard/ProgressBar'
import { OutlineCard } from 'components/Card'
import { useGovernanceDetails, useUserStaking } from '../../hooks/useGovernanceDetail'
import { DecisionForm } from './DecisionForm'
import { GOVERNANCE_TOKEN } from '../../constants'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { tryParseAmount } from '../../state/swap/hooks'
import { useGovernanceContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { CardColor } from 'components/NFTCard'
import { TimerCapsule } from 'components/NFTCard/Capsule'

export enum VoteOption {
  FOR = 'for',
  AGAINST = 'against'
}
export enum ConfirmType {
  Vote = 'Vote',
  Claim = 'Claim'
}
export enum StatusOption {
  Live = 'Live',
  Success = 'Success',
  Failed = 'Failed'
}

export function toNumber(weiValue: string): string {
  if (weiValue === '') return '-'
  return new TokenAmount(GOVERNANCE_TOKEN, JSBI.BigInt(weiValue)).toSignificant()
}

const Wrapper = styled.div`
  width: 100%;
  max-width: 1160px;
  background: #ffffff;
  margin-bottom: auto;
  /* max-width: 1280px; */
  border-radius: 32px;
  padding: 20px 52px;
  margin: 36px 0 50px;
  display: flex;
  flex-direction: column;
  jusitfy-content: cetner;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 0 24px
  `};
  ${({ theme }) => theme.mediaWidth.upToLarge`
  margin-bottom: 70px;
  `};
`

const CustomRowBetween = styled(RowBetween)`
  align-items: flex-start;
  & > div {
    width: 47%;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: stretch;
    &>div{
      width: 100%;
    }
    &>div:first-child{
      margin-bottom: 20px;
      text-align:center
    }
`};
`

export default function GovernancePageDetail({
  match: {
    params: { governanceIndex }
  }
}: RouteComponentProps<{ governanceIndex?: string }>) {
  const { account, chainId } = useWeb3React()
  const [selected, setSelected] = useState<VoteOption>(VoteOption.FOR)
  const [voteValue, setVoteValue] = useState('')
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')

  const theme = useTheme()
  const history = useHistory()
  const { data } = useGovernanceDetails(governanceIndex ?? '')
  const balance = useCurrencyBalance(account ?? undefined, GOVERNANCE_TOKEN)
  const contact = useGovernanceContract()
  const addTransaction = useTransactionAdder()
  const userStaking = useUserStaking(governanceIndex)

  const inputValue = useMemo(() => {
    return tryParseAmount(voteValue, GOVERNANCE_TOKEN)
  }, [voteValue])

  const onClaim = useCallback(() => {
    setTxHash('')
    if (!contact || StatusOption.Live === data.status) {
      return
    }
    setAttemptingTxn(true)
    const args = [governanceIndex]
    contact
      .unStaking(...args, {})
      .then((response: TransactionResponse) => {
        setAttemptingTxn(false)
        addTransaction(response, {
          summary: `claim ${toNumber(userStaking.totalStake)} Matter`
        })

        setTxHash(response.hash)
      })
      .catch((error: any) => {
        setAttemptingTxn(false)
      })
  }, [contact, data, governanceIndex, addTransaction, userStaking])

  const onVote = useCallback(() => {
    setTxHash('')
    if (!contact || !inputValue) {
      return
    }
    const args = [governanceIndex, selected === VoteOption.FOR ? 1 : 2, inputValue?.raw.toString()]

    setAttemptingTxn(true)

    contact
      .vote(...args, {})
      .then((response: TransactionResponse) => {
        setAttemptingTxn(false)
        addTransaction(response, {
          summary: `vote ${selected} ${voteValue} Matter`
        })
        setVoteValue('')

        setTxHash(response.hash)
      })
      .catch((error: any) => {
        setAttemptingTxn(false)
        if (error?.code !== 4001) {
          console.error('---->', error)
        }
      })
  }, [contact, inputValue, governanceIndex, selected, addTransaction, voteValue])

  const handleBackClick = useCallback(() => history.push('/governance'), [history])

  const handleSelectVoteOption = useCallback(
    (option: VoteOption) => () => {
      setSelected(option)
    },
    []
  )

  const handleInput = useCallback(value => {
    setVoteValue(value)
  }, [])

  const handleMax = useCallback(() => {
    setVoteValue(balance ? balance.toSignificant() : '')
  }, [balance])

  const enoughBalance = useMemo(() => {
    return balance && inputValue && !balance.lessThan(inputValue)
  }, [inputValue, balance])

  if (!data) {
    return null
  }

  const {
    /*creator,*/ title,
    status,
    contents,
    voteFor: voteForRaw,
    voteAgainst: voteAgainstRaw,
    totalVotes: totalVotesRaw,
    timeLeft,
    id,
    voteForPercentage
  } = data
  const voteFor = toNumber(voteForRaw),
    totalVotes = toNumber(totalVotesRaw),
    voteAgainst = toNumber(voteAgainstRaw)

  return (
    <>
      <Wrapper>
        <AutoColumn gap="50px" style={{ width: '100%' }}>
          <AutoColumn gap="14px">
            <RowBetween>
              <ButtonEmpty width="106px" color={theme.text3} onClick={handleBackClick}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="17.5" stroke="black" strokeOpacity="0.1" />
                  <path d="M27 18H11M11 18L16 13M11 18L16 23" stroke="black" strokeWidth="1.5" />
                </svg>
                Back
              </ButtonEmpty>
              <TimerCapsule color={CardColor.RED} timeLeft={+timeLeft} />
              <TYPE.black style={{ width: 106, textAlign: 'right' }}>#{id}</TYPE.black>
            </RowBetween>
            <TYPE.black fontWeight={700} fontSize={40} textAlign="center">
              {title ? title : 'Untitled'}
            </TYPE.black>
            <TYPE.darkGray>
              <RowFixed style={{ margin: '0 auto' }}>
                {id}
                {/* {address}&nbsp;&nbsp;
                <CopyHelper toCopy={address} /> */}
              </RowFixed>
            </TYPE.darkGray>
          </AutoColumn>
          <CustomRowBetween>
            <TYPE.body color={'#000000'}>{contents?.details ? contents : 'No content Available'}</TYPE.body>
            <OutlineCard>
              <AutoColumn gap="36px">
                <TYPE.black fontSize={28}> {totalVotes} votes:</TYPE.black>
                <AutoColumn gap="8px">
                  <RowBetween>
                    <TYPE.darkGray>Votes For:</TYPE.darkGray>
                    <TYPE.darkGray>Votes Against:</TYPE.darkGray>
                  </RowBetween>
                  <ProgressBar color={CardColor.RED} leftPercentage={voteForPercentage} />
                  <RowBetween>
                    <TYPE.black fontWeight={400}>
                      <span style={{ fontSize: 20 }}>{voteFor}</span>Auction
                    </TYPE.black>
                    <TYPE.black fontWeight={400}>
                      <span style={{ fontSize: 20 }}> {voteAgainst}</span>Auction
                    </TYPE.black>
                  </RowBetween>
                </AutoColumn>
              </AutoColumn>
            </OutlineCard>
          </CustomRowBetween>
          <DecisionForm
            timeLeft={timeLeft}
            status={status}
            userStaking={userStaking}
            chainId={chainId}
            contents={contents}
            onVote={onVote}
            onClaim={onClaim}
            inputValue={inputValue}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            enoughBalance={enoughBalance}
            selected={selected}
            onSelect={handleSelectVoteOption}
            voteValue={voteValue}
            onInput={handleInput}
            onMax={handleMax}
          />
        </AutoColumn>
      </Wrapper>
    </>
  )
}
