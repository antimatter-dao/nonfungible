import { ChainId, Currency } from '@uniswap/sdk'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import Modal from '../Modal'
import { Text } from 'rebass'
import { CloseIcon } from '../../theme/components'
import { RowBetween, RowFixed } from '../Row'
import { CheckCircle } from 'react-feather'
import { ButtonBlack, ButtonGray } from '../Button'
import { AutoColumn } from '../Column'
import MetaMaskLogo from '../../assets/images/metamask.png'
import { useActiveWeb3React } from '../../hooks'
import useTheme from 'hooks/useTheme'
import useAddTokenToMetamask from 'hooks/useAddTokenToMetamask'
import { LoadingView, SubmittedView } from 'components/ModalViews'
// import { CrossCircle } from 'components/Icons/'
import { TYPE } from 'theme'

const Wrapper = styled.div`
  width: 100%;
  /* max-width: 480px; */
  border-radius: 42px;
  /* background: ${({ theme }) => theme.gradient1}; */
`
const Section = styled(AutoColumn)`
  padding: 50px;
`

const BottomSection = styled(Section)`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 0 3rem 2rem;
`

const Close = styled(CloseIcon)`
  color: ${({ theme }) => theme.text2};
`

const StyledLogo = styled.img`
  height: 16px;
  width: 16px;
  margin-left: 6px;
`

function ConfirmationPendingContent({ onDismiss, pendingText = '' }: { onDismiss: () => void; pendingText?: string }) {
  const theme = useTheme()
  return (
    <>
      <LoadingView onDismiss={onDismiss}>
        <AutoColumn gap="12px">
          <Text fontWeight={700} fontSize={30}>
            Wallet interaction request
          </Text>
          <TYPE.darkGray fontSize={16} fontWeight={400}>
            Please open your wallet and confirm in the transaction activity to proceed your order
          </TYPE.darkGray>
          <AutoColumn gap="12px" justify={'center'}>
            <Text fontWeight={400} fontSize={14} textAlign="center" color={theme.text2}>
              {pendingText}
            </Text>
          </AutoColumn>
        </AutoColumn>
      </LoadingView>
    </>
  )
}

function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
  currencyToAdd?: Currency | undefined
}) {
  const theme = useContext(ThemeContext)

  const { library } = useActiveWeb3React()

  const { addToken, success } = useAddTokenToMetamask(currencyToAdd)

  return (
    <>
      <SubmittedView onDismiss={onDismiss} hash={hash}>
        <Text fontWeight={400} fontSize={30}>
          Transaction Submitted
        </Text>

        {currencyToAdd && library?.provider?.isMetaMask && (
          <ButtonGray
            mt="12px"
            padding="8px 15px"
            width="fit-content"
            onClick={addToken}
            style={{ margin: 0, background: theme.translucent }}
          >
            {!success ? (
              <RowFixed>
                <Text fontSize={13} lineHeight="17.36px" color={theme.text1}>
                  Add {currencyToAdd.symbol} to Metamask
                </Text>
                <StyledLogo src={MetaMaskLogo} />
              </RowFixed>
            ) : (
              <RowFixed>
                Added {currencyToAdd.symbol}{' '}
                <CheckCircle size={'16px'} stroke={theme.green1} style={{ marginLeft: '6px' }} />
              </RowFixed>
            )}
          </ButtonGray>
        )}
      </SubmittedView>
    </>
  )
}

export function ConfirmationModalContent({
  title,
  bottomContent,
  onDismiss,
  topContent
}: {
  title: string
  onDismiss: () => void
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}) {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <div></div>
          <Text fontWeight={500} fontSize={18}>
            {title}
          </Text>
          <Close onClick={onDismiss} />
        </RowBetween>
        {topContent()}
      </Section>
      <BottomSection gap="8px">{bottomContent()}</BottomSection>
    </Wrapper>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Text fontWeight={700} fontSize={30}>
            Oops!
          </Text>
          <Close onClick={onDismiss} />
        </RowBetween>
        <AutoColumn style={{ padding: '1rem 0 2rem' }} gap="24px">
          <TYPE.darkGray fontWeight={400} fontSize={16} style={{ width: '85%' }}>
            {message}
          </TYPE.darkGray>
        </AutoColumn>
        <ButtonBlack onClick={onDismiss} height={60}>
          Close
        </ButtonBlack>
      </Section>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string | undefined
  content?: () => React.ReactNode
  attemptingTxn: boolean
  pendingText?: string
  currencyToAdd?: Currency | undefined
  submittedContent?: () => React.ReactNode
}

export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  error,
  errorMsg,
  currencyToAdd,
  submittedContent
}: ConfirmationModalProps & { error?: boolean; errorMsg?: string }) {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} width="600px" maxWidth={600} zIndex={5}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : error ? (
        <TransactionErrorContent
          message={errorMsg ?? 'Something went wrong. Please try again'}
          onDismiss={onDismiss}
        ></TransactionErrorContent>
      ) : hash ? (
        <>
          (
          {submittedContent ? (
            submittedContent()
          ) : (
            <TransactionSubmittedContent
              chainId={chainId}
              hash={hash}
              onDismiss={onDismiss}
              currencyToAdd={currencyToAdd}
            />
          )}
          ){' '}
        </>
      ) : (
        content && content()
      )}
    </Modal>
  )
}
