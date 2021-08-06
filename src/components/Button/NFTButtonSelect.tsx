import React, { useMemo, useRef, useState, useCallback } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { ButtonProps } from 'rebass/styled-components'
import { ButtonOutlined, Base } from '.'
import { RowBetween, AutoRow } from '../Row'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { TYPE } from '../../theme'
import useTheme from '../../hooks/useTheme'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ReactComponent as Check } from 'assets/svg/black_check.svg'

export const StyledDropDown = styled(DropDown)`
  margin: 0 11px 0 0;
  width: 17px;
  height: 17px;
  path {
    stroke-width: 1.5px;
    stroke: ${({ theme }) => theme.bg1};
  }
`

export const ButtonSelectStyle = styled(ButtonOutlined)<{ selected?: boolean; width?: string }>`
  width: ${({ width }) => (width ? width : '100%')};
  font-weight: 400;
  height: 3rem;
  background-color: ${({ theme }) => theme.text1};
  color: ${({ selected, theme }) => (selected ? theme.bg1 : theme.bg5)};
  border-radius: 10px;
  border: unset;
  padding: 0 10px 0 15px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  :focus,
  :active {
    border: 1px solid ${({ selected, theme }) => (selected ? theme.bg2 : darken(0.05, theme.primary1))};
    box-shadow: none;
  }
  :hover {
    border: 1px solid ${({ selected, theme }) => (selected ? theme.bg2 : darken(0.05, theme.bg5))};
    box-shadow: none;
  }
  &:disabled {
    :hover {
      border-color: transparent;
    }
    opacity: 100%;
    cursor: auto;
    color: ${({ theme }) => theme.text3};
  }
`
const OptionWrapper = styled.div<{ isOpen: boolean; width?: string }>`
  position: absolute;
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  width: ${({ width }) => width ?? '100%'};
  border-radius: 14px;
  overflow: hidden;
  z-index: 3;
  margin-top: 4px;
  background-color: ${({ theme }) => theme.text1};
`
const SelectOption = styled(Base)<{ selected: boolean }>`
  border: none;
  font-weight: 400;
  border-radius: unset;
  color: ${({ theme }) => theme.bg1};
  background-color: ${({ theme }) => theme.text1};
  padding: 14px;
  justify-content: space-between;
  :hover,
  :focus,
  :active {
    background-color: rgba(0, 0, 0, 0.1);
  }
`

export default function ButtonSelect({
  children,
  label,
  options,
  onSelection,
  selectedId,
  onClick,
  width = '100%',
  disabled,
  placeholder = 'Select Option Type',
  marginRight = '20px'
}: ButtonProps & {
  disabled?: boolean
  label?: string
  onSelection?: (id: string) => void
  options?: { id: string; option: string | JSX.Element }[]
  selectedId?: string
  onClick?: () => void
  placeholder?: string
  width?: string
  marginRight?: string
}) {
  const node = useRef<HTMLDivElement>()
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  useOnClickOutside(node, () => setIsOpen(false))
  const buttonContent = useMemo(() => {
    if (options) {
      if (options.length > 0) {
        const selected = options.find(({ id }) => id === selectedId)
        return selected ? selected.option : placeholder
      }
      return placeholder
    }
    return children
  }, [options, children, selectedId, placeholder])
  const handleClick = useCallback(() => {
    setIsOpen(!isOpen)
    onClick && onClick()
  }, [isOpen, onClick])
  return (
    <div style={{ position: 'relative', marginRight: marginRight, width: width, flex: '1 0' }}>
      {label && (
        <AutoRow style={{ marginBottom: '4px' }}>
          <TYPE.body color={theme.text3} fontWeight={500} fontSize={14}>
            {label}
          </TYPE.body>
        </AutoRow>
      )}
      <ButtonSelectStyle onClick={handleClick} selected={!!selectedId} disabled={disabled}>
        <RowBetween>
          <div style={{ display: 'flex', alignItems: 'center' }}>{buttonContent}</div>
          {!disabled && <StyledDropDown />}
        </RowBetween>
      </ButtonSelectStyle>
      {options && onSelection && (
        <OptionWrapper isOpen={isOpen} ref={node as any}>
          {options.map(({ id, option }) => {
            return (
              <SelectOption
                key={id}
                selected={selectedId === id}
                onClick={() => {
                  onSelection(id)
                  setIsOpen(false)
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 500 }}>{option}</div>
                {selectedId === id && <Check />}
              </SelectOption>
            )
          })}
        </OptionWrapper>
      )}
    </div>
  )
}
