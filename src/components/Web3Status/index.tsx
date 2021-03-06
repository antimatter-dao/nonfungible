import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken } from 'polished'
import React, { useMemo } from 'react'
import { Activity } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useHasSocks } from '../../hooks/useSocksBalance'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import { ButtonOutlined } from '../Button'
import Loader from '../Loader'
import { RowBetween } from '../Row'
import WalletModal from '../WalletModal'
import useTheme from 'hooks/useTheme'

const Web3StatusGeneric = styled(ButtonOutlined)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  :hover,
  :focus {
    outline: none;
    box-shadow: none;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  height: 100%;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
  padding: 8px 25px;
  border: 1px solid ${({ theme }) => theme.text1};
  border-color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.text1};
  color: ${({ theme }) => theme.bg1};
  font-weight: 400;
  border-radius: 49px;
  :hover,
  :focus {
    opacity: 0.7;
    color: ${({ theme }) => theme.bg1};
  }

  ${({ faded }) =>
    faded &&
    css`
      background-color: ${({ theme }) => theme.text1};
      border: 1px solid ${({ theme }) => theme.text1};
      color: ${({ theme }) => theme.bg1};

      :hover,
      :focus {
        border: 1px solid ${({ theme }) => darken(0.05, theme.text1)};
        color: ${({ theme }) => darken(0.05, theme.bg1)};
      }
    `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  width:100%`}
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  cursor: auto;
  color: ${({ pending, theme }) => (pending ? theme.text3 : theme.text4)};
  padding: 0;
  border: none
  :hover,
  :focus {
    border: none;
    box-shadow: none;
  }
  & p {
    margin: 0;
    margin: 0 16px;
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 13px;
  width: fit-content;
  font-weight: 400;
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

const SOCK = (
  <span role="img" aria-label="has socks emoji" style={{ marginTop: -4, marginBottom: -4 }}>
    ????
  </span>
)

function Web3StatusInner() {
  const { t } = useTranslation()
  const { account, error } = useWeb3React()

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)

  const hasPendingTransactions = !!pending.length
  const hasSocks = useHasSocks()
  const toggleWalletModal = useWalletModalToggle()
  const theme = useTheme()
  if (account) {
    return (
      <>
        <Web3StatusConnected id="web3-status-connected" pending={hasPendingTransactions}>
          {/* {!hasPendingTransactions && connector && <StatusIcon connector={connector} />} */}
          {hasPendingTransactions ? (
            <RowBetween style={{ padding: '0 5px' }}>
              <Loader stroke={theme.bg3} />
              <Text style={{ marginLeft: '12px' }} color={theme.bg3}>
                {pending?.length} Pending
              </Text>
            </RowBetween>
          ) : (
            <>
              {hasSocks ? SOCK : null}
              <Text>{ENSName || shortenAddress(account, 5)}</Text>
            </>
          )}
        </Web3StatusConnected>
      </>
    )
  } else if (error) {
    return (
      <Web3StatusError onClick={toggleWalletModal}>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}</Text>
      </Web3StatusError>
    )
  } else {
    return (
      <Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account}>
        {t('Connect Wallet')}
      </Web3StatusConnect>
    )
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}
