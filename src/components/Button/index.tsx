import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'

import { RowBetween } from '../Row'
import { ChevronDown, ArrowLeft } from 'react-feather'
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import useTheme from 'hooks/useTheme'

interface StyleProp {
  borderRadius?: string
}

export const Base = styled(RebassButton)<{
  padding?: string
  width?: string
  borderRadius?: string
  altDisabledStyle?: boolean
}>`
  padding: ${({ padding }) => (padding ? padding : '14px')};
  width: ${({ width }) => (width ? width : '100%')};
  font-weight: 400;
  text-align: center;
  border-radius: 49px;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`

export const ButtonPrimary = styled(Base)`
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.bg1};
  &:hover {
    background-color: ${({ theme }) => theme.primary4};
  }
  &:disabled {
    cursor: auto;
    box-shadow: none;
    background: ${({ theme }) => theme.primary5};
    border: 1px solid
      ${({ theme, altDisabledStyle, disabled }) =>
        altDisabledStyle ? (disabled ? theme.bg3 : theme.primary1) : theme.primary5};
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.5' : '1')};
  }
`

export const ButtonBlack = styled(Base)`
  background-color: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text1};
  border: 1px solid transparent;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.bg4};
  }
  &:hover {
    background-color: ${({ theme }) => theme.bg2};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.bg4};
  }
  &:disabled {
    cursor: auto;
    box-shadow: none;
    background: ${({ theme }) => theme.bg4};
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.5' : '1')};
  }
`

export const ButtonGray = styled(Base)`
  background-color: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text1};
  font-size: 16px;
  font-weight: 500;
  &:focus {
    color: ${({ theme }) => theme.text4};
  }
  &:hover {
    color: ${({ theme }) => theme.text4};
  }
  &:active {
    color: ${({ theme }) => theme.text4};
  }
  :disabled {
    color: ${({ theme }) => theme.text5};
  }
`

export const ButtonSecondary = styled(Base)`
  border: 1px solid ${({ theme }) => theme.primary4};
  color: ${({ theme }) => theme.primary1};
  background-color: transparent;
  font-size: 16px;
  border-radius: 12px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.bg4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.bg4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
  }
`

export const ButtonOutlined = styled(Base)`
  border: 1px solid ${({ theme }) => theme.text5};
  background-color: transparent;
  color: ${({ theme }) => theme.text5};

  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
    border: 1px solid ${({ theme }) => theme.bg4};
  }
  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
    border: 1px solid ${({ theme }) => theme.bg4};
  }
  &:active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg2};
  }
`

export const ButtonOutlinedPrimary = styled(Base)`
  border: 1px solid ${({ theme }) => theme.primary1};
  background-color: transparent;
  color: ${({ theme }) => theme.primary1};

  :hover,
  :focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.primary4};
    border-color: ${({ theme }) => theme.primary4};
    color: ${({ theme }) => theme.primary4};
  }
  :active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }

  &:disabled {
    border-color: ${({ theme }) => theme.primary5};
    color: ${({ theme }) => theme.primary5};
    cursor: auto;
  }
`

export const ButtonOutlinedBlack = styled(Base)`
  border: 1px solid ${({ theme }) => theme.bg1};
  background-color: transparent;
  color: ${({ theme }) => theme.bg1};

  :hover,
  :focus {
    opacity: 0.7;
  }
  :active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.text2};
  }

  &:disabled {
    opacity: 0.4;
    cursor: auto;
  }
`

export const ButtonEmpty = styled(Base)<{ color?: string }>`
  background-color: transparent;
  color: ${({ theme, color }) => color ?? theme.primary1};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    text-decoration: none;
  }
  &:hover {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`
export const ButtonWhite = styled(Base)`
  border: 1px solid transparent;
  background-color: ${({ theme }) => theme.text1};
  color: black;

  &:focus {
    opacity: 0.9;
  }
  &:hover {
    opacity: 0.9;
  }
  &:active {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonOutlinedWhite = styled(Base)`
  border: 1px solid #ffffff;
  background-color: ${({ theme }) => theme.bg1};
  color: #ffffff;

  &:focus {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    box-shadow: 0 0 0 1pt ${darken(0.6, '#ffffff')};
  }
  &:hover {
    box-shadow: 0 0 0 1pt ${darken(0.6, '#ffffff')};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${darken(0.6, '#ffffff')};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonConfirmedStyle = styled(Base)`
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.bg1};
  border: 1px solid transparent;

  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonErrorStyle = styled(Base)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red1)};
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red1)};
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    background-color: ${({ theme }) => theme.red1};
    border: 1px solid ${({ theme }) => theme.red1};
  }
`

export function ButtonConfirmed({
  confirmed,
  altDisabledStyle,
  ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps & StyleProp) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />
  }
}

export function ButtonError({
  error,
  outlined,
  ...rest
}: { error?: boolean; outlined?: boolean } & ButtonProps & StyleProp) {
  if (error) {
    return <ButtonErrorStyle {...rest} />
  } else if (outlined) {
    return <ButtonOutlined {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}

export function ButtonDropdown({
  disabled = false,
  children,
  ...rest
}: { disabled?: boolean } & ButtonProps & StyleProp) {
  return (
    <ButtonPrimary {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonPrimary>
  )
}

export function ButtonDropdownGrey({
  disabled = false,
  children,
  ...rest
}: { disabled?: boolean } & ButtonProps & StyleProp) {
  return (
    <ButtonGray {...rest} disabled={disabled} style={{ borderRadius: '20px' }}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonGray>
  )
}

export function ArrowLeftButton({ onClick }: { onClick: () => void }) {
  const theme = useTheme()
  return (
    <ButtonEmpty onClick={onClick} padding="8px" width="fit-content">
      <ArrowLeft color={theme.text1} />
    </ButtonEmpty>
  )
}
