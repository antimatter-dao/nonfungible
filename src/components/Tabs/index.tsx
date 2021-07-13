import styled from 'styled-components'
import { RowFixed } from '../Row'
import { ButtonEmpty } from '../Button'

const StyledTabs = styled(RowFixed)`
  margin-bottom: 10px;
`

const StyledTabItem = styled(ButtonEmpty)<{ current?: string | boolean }>`
  color: ${({ theme, current }) => (current ? theme.black : theme.text4)};
  width: auto;
  font-family: Roboto;
  font-weight: bold;
  margin-right: 32px;
  border-radius: 0;
  padding: 14px 0 8px;
  border-bottom: ${({ theme, current }) => `2px solid ${current ? theme.black : 'transparent'}`};
  &:hover {
    color: ${({ theme }) => theme.black};
  }
`
export { StyledTabItem, StyledTabs }
