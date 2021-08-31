import React from 'react'
import { useActiveWeb3React } from '../../hooks'
import { AutoColumn, ColumnCenter } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ReactComponent as CheckCircle } from '../../assets/svg/transaction_submitted.svg'
import { ReactComponent as CrossCircle } from '../../assets/svg/transaction_error.svg'
// import Circle from '../../assets/svg/gray_loader.svg'
import { getEtherscanLink } from '../../utils'
import { ExternalLink } from '../../theme/components'
import useTheme from 'hooks/useTheme'
import { ButtonBlack } from 'components/Button'
import Loader from 'components/Loader'
import { Dots } from 'components/swap/styleds'

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  color: #ffffff
  height: 100%;
  `}
`

const LoadingViewGrid = styled(AutoColumn)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 100%
    margin-top: 12px
  `}
`

const ButtonBlackStyled = styled(ButtonBlack)`
  margin-top: 32px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  background-color: #ffffff;
  color: #000000
  :disabled{
    background-color: #ffffff;
    color: #000000
  }
`}
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 0 0 28px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  path{
    fill: #ffffff
  }
  `}
`

export function LoadingView({ children, onDismiss }: { children: any; onDismiss: () => void }) {
  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <LoadingViewGrid gap="28px" justify={'center'}>
        {children}
        <ConfirmedIcon>
          {/* <CustomLightSpinner src={Circle} alt="loader" size={'45px'} /> */}
          <Loader size="72px" />
        </ConfirmedIcon>

        {/* <TYPE.smallGray>Confirm this transaction in your wallet</TYPE.smallGray> */}
      </LoadingViewGrid>
      <ButtonBlackStyled disabled height={60}>
        Confirmation
        <Dots />
      </ButtonBlackStyled>
    </ConfirmOrLoadingWrapper>
  )
}

export function SubmittedView({
  children,
  onDismiss,
  hash,
  hideLink,
  isError
}: {
  children: any
  onDismiss: () => void
  hash: string | undefined
  hideLink?: boolean
  isError?: boolean
}) {
  const { chainId } = useActiveWeb3React()
  const theme = useTheme()

  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        {isError ? <CrossCircle /> : <CheckCircle style={{ width: '32px', height: '32px' }} />}
      </ConfirmedIcon>
      <AutoColumn gap="32px" justify={'center'}>
        {children}
        {!hideLink && !isError && chainId && hash && (
          <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')}>
            <TYPE.main fontWeight={400} fontSize={14} color={theme.text4}>
              View on Etherscan
            </TYPE.main>
          </ExternalLink>
        )}
      </AutoColumn>
      <ButtonBlackStyled onClick={onDismiss} height={60}>
        Close
      </ButtonBlackStyled>
    </ConfirmOrLoadingWrapper>
  )
}
