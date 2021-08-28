import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import { StyledInput } from 'components/NumericalInput'
import { AutoRow } from 'components/Row'
import { TYPE } from 'theme'

const CustomInput = styled(StyledInput)<{
  disabled?: boolean
  error?: boolean
  padding: string
  height?: string
  borderColor?: string
}>`
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme, disabled }) => (disabled ? theme.text3 : theme.bg1)};
  align-items: center;
  padding: ${({ padding }) => padding + ' 20px'};
  width: 100%;
  background-color: ${({ disabled }) => (disabled ? 'rgba(0, 0, 0, 0.1)' : '#ffffff')};
  border-radius: 10px;
  height:${({ height }) => height ?? 'auto'}
  border: 1px solid ${({ theme, error, borderColor }) => (error ? theme.red1 : borderColor ?? theme.text3)};
  ::placeholder {
    color: ${({ theme }) => theme.text3};
  } 
`

export const CustomTextArea = styled.textarea<{
  error?: boolean
  fontSize?: string
  align?: string
  borderColor?: string
}>`
  color: ${({ theme, disabled }) => (disabled ? theme.text3 : theme.bg1)};
  width: 100%
  position: relative;
  font-size: 16px;
  outline: none;
  border: none;
  padding: 20px 1rem;
  border-radius: 14px;
  border: 1px solid ${({ theme, error, borderColor }) => (error ? theme.red1 : borderColor ?? theme.text3)};
  background-color: ${({ disabled }) => (disabled ? 'rgba(0, 0, 0, 0.1)' : '#ffffff')};
  text-align: ${({ align }) => align && align};
  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::placeholder {
    color: ${({ theme }) => theme.text3};
  } 
  resize: none;
`

const Container = styled.div<{ width: string; maxWidth?: string }>`
  width: ${({ width }) => width};
  max-width: ${({ maxWidth }) => maxWidth ?? 'unset'};
`

const LabelRow = styled.div`
  align-items: center;
  color: #000000;
  font-size: 0.75rem;
  line-height: 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.text3};
  }
  margin-bottom: 8px;
  ${({ theme }) => theme.flexRowNoWrap}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    color: #ffffff
  `}
`

export const TextInput = React.memo(function InnerInput({
  placeholder,
  label,
  textarea,
  disabled,
  name,
  error,
  width = '100%',
  maxWidth,
  hint,
  height,
  borderColor,
  defaultTextAreaValue,
  padding = '20px',
  ...rest
}: {
  error?: boolean
  label?: string
  fontSize?: string
  align?: 'right' | 'left'
  textarea?: boolean
  maxWidth?: string
  width?: string
  hint?: string
  padding?: string
  height?: string
  borderColor?: string
  defaultTextAreaValue?: string
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  return (
    <Container width={width} maxWidth={maxWidth}>
      {label && (
        <LabelRow>
          <AutoRow justify="space-between">
            {label && (
              <Text fontWeight={500} fontSize={14}>
                {label}
              </Text>
            )}
          </AutoRow>
        </LabelRow>
      )}
      {textarea ? (
        <CustomTextArea
          placeholder={placeholder || 'text input'}
          spellCheck="true"
          maxLength={200}
          rows={4}
          cols={50}
          disabled={disabled}
          name={name}
          error={error}
          borderColor={borderColor}
        >
          {defaultTextAreaValue}
        </CustomTextArea>
      ) : (
        <CustomInput
          {...rest}
          height={height}
          padding={padding}
          name={name}
          type="text"
          placeholder={placeholder || 'text input'}
          spellCheck="true"
          disabled={disabled}
          error={error}
          borderColor={borderColor}
        />
      )}
      {hint && (
        <TYPE.darkGray fontSize={14} style={{ marginTop: 8 }}>
          {hint}
        </TYPE.darkGray>
      )}
    </Container>
  )
})

export const TextValueInput = React.memo(function InnerInput({
  placeholder,
  label,
  textarea,
  disabled,
  name,
  error,
  width = '100%',
  maxWidth,
  hint,
  height,
  maxLength,
  padding = '20px',
  value,
  onUserInput,
  borderColor,
  ...rest
}: {
  error?: boolean
  label?: string
  fontSize?: string
  align?: 'right' | 'left'
  textarea?: boolean
  maxWidth?: string
  width?: string
  hint?: string
  padding?: string
  height?: string
  maxLength?: number
  value: string | number
  borderColor?: string
  onUserInput: (input: string) => void
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  return (
    <Container width={width} maxWidth={maxWidth}>
      {label && (
        <LabelRow>
          <AutoRow justify="space-between">
            {label && (
              <Text fontWeight={500} fontSize={14}>
                {label}
              </Text>
            )}
          </AutoRow>
        </LabelRow>
      )}
      {textarea ? (
        <CustomTextArea
          value={value}
          onChange={event => {
            onUserInput(event.target.value)
          }}
          placeholder={placeholder || 'text input'}
          spellCheck="true"
          maxLength={maxLength}
          rows={4}
          cols={50}
          disabled={disabled}
          name={name}
          error={error}
          borderColor={borderColor}
        />
      ) : (
        <CustomInput
          {...rest}
          value={value}
          onChange={event => {
            onUserInput(event.target.value)
          }}
          height={height}
          padding={padding}
          name={name}
          type="text"
          placeholder={placeholder || 'text input'}
          spellCheck="true"
          maxLength={maxLength}
          disabled={disabled}
          error={error}
          borderColor={borderColor}
        />
      )}
      {hint && (
        <TYPE.darkGray fontSize={14} style={{ marginTop: 8 }}>
          {hint}
        </TYPE.darkGray>
      )}
    </Container>
  )
})

export default TextInput
