import { AbstractConnector } from '@web3-react/abstract-connector'
import React from 'react'
import styled from 'styled-components'
import Loader from '../Loader'
import { RowBetween } from 'components/Row'
import { ButtonBlack } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'

const PendingSection = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  width: 100%;
  & > * {
    width: 100%;
  }
`

const StyledLoader = styled(Loader)`
  margin-right: 1rem;
`

const LoadingMessage = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: flex-start;
  border-radius: 12px;
  margin: 20px;
  width: 500px;
  border: 1px solid ${({ theme }) => theme.bg1};

  & > * {
    padding: 1rem;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
  `}
`
const ButtonGroup = styled(RowBetween)`
  button:first-child {
    margin-right: 16px;
  }
  width: 500px;
  ${({ theme }) => theme.mediaWidth.upToMedium`width: 100%;`}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column
  button:first-child{
    margin-left: unset
    margin-bottom: 12px;
  };
  padding-bottom: 20px
`}
`
const LoadingWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: center;
`

export default function PendingView({
  connector,
  error = false,
  setPendingError,
  tryActivation,
  children
}: {
  children: React.ReactNode
  connector?: AbstractConnector
  error?: boolean
  setPendingError: (error: boolean) => void
  tryActivation: (connector: AbstractConnector) => void
}) {
  return (
    <AutoColumn gap="32px">
      <PendingSection>
        {error ? (
          <AutoColumn justify="flex-start" gap="16px">
            <TYPE.black fontSize={30} fontWeight={700}>
              Oops!
            </TYPE.black>
            Error connecting. Please try again
          </AutoColumn>
        ) : (
          <>
            <LoadingMessage>
              <LoadingWrapper>
                <StyledLoader />
                Initializing...
              </LoadingWrapper>
            </LoadingMessage>
          </>
        )}
      </PendingSection>
      {error && (
        <ButtonGroup>
          {children}
          {error && (
            <ButtonBlack
              onClick={() => {
                setPendingError(false)
                connector && tryActivation(connector)
              }}
            >
              Try Again
            </ButtonBlack>
          )}
        </ButtonGroup>
      )}
    </AutoColumn>
  )
}
