import styled from 'styled-components'

export const SwitchTabWrapper = styled.div<{ isWhite?: boolean }>`
  border-bottom: 1px solid ${({ theme, isWhite }) => (isWhite ? theme.text5 : theme.text2)};
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    border-color:${theme.text5};
    overflow-x: auto;
    overflow-y: hidden;
    `};
`

export const Tab = styled.button<{ selected: boolean; isWhite?: boolean }>`
  border: none;
  background: none;
  padding: 14px 0;
  margin-right: 40px;
  font-size: 16px;
  font-weight: 700;
  color: ${({ selected, theme, isWhite }) =>
    isWhite ? (selected ? '#ffffff' : theme.text5) : selected ? '#000000' : theme.text2};
  border-bottom: 3px solid
    ${({ selected, isWhite }) =>
      isWhite ? (selected ? '#ffffff' : 'transparent') : selected ? '#000000' : 'transparent'};
  margin-bottom: -1px;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    color: #000000;
  }
  ${({ theme, selected }) => theme.mediaWidth.upToSmall`
  border-color: ${selected ? '#ffffff' : 'transparent'};
  color: ${selected ? '#ffffff' : theme.text5};
  &:hover {
    color: #ffffff;
  }
  `}
`
