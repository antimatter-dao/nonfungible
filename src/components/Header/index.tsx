import { TokenAmount } from '@uniswap/sdk'
import React, { useCallback } from 'react'
import { Link, NavLink } from 'react-router-dom'
import styled from 'styled-components'
// import { useTranslation } from 'react-i18next'
import { CountUp } from 'use-count-up'
import { useActiveWeb3React } from '../../hooks'
import { useAggregateUniBalance } from '../../state/wallet/hooks'
import { ButtonText, TYPE } from '../../theme'
import Row, { RowFixed, RowBetween } from '../Row'
import Web3Status from '../Web3Status'
import usePrevious from '../../hooks/usePrevious'
import { ReactComponent as Logo } from '../../assets/svg/antimatter_logo.svg'
import ToggleMenu from './ToggleMenu'
import { ButtonOutlinedPrimary } from 'components/Button'
import { ReactComponent as AntimatterIcon } from 'assets/svg/antimatter_icon.svg'
import useUserPanel from 'hooks/useUserPanel'
import { useToggleCreationModal } from 'state/application/hooks'
import CreationNFTModal from 'components/Creation'
import { useCurrentUserInfo, useLogin } from 'state/userInfo/hooks'

const activeClassName = 'ACTIVE'

interface TabContent {
  title: string
  route?: string
  link?: string
  titleContent?: JSX.Element
}

interface Tab extends TabContent {
  subTab?: TabContent[]
}

export const tabs: Tab[] = [
  { title: 'Spot Index', route: 'spot_index' },
  { title: 'Future Index', route: 'future_index' },
  { title: 'Locker', route: 'locker' },
  { title: 'Governance', route: 'governance' }
]

export const headerHeightDisplacement = '32px'

const HeaderFrame = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  width: 100%;
  top: 0;
  height: ${({ theme }) => theme.headerHeight}
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.text5};
  padding: 21px 0 0;
  z-index: 5;
  background-color:${({ theme }) => theme.bg1}
  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: 100%;
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  justify-self: flex-end;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    height: ${theme.headerHeight};
    flex-direction: row;
    align-items: center;
    justify-self: center;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    background-color: ${theme.bg2};
    justify-content: center;
    border-top: 1px solid;
    border-top-color: #303030;
  `};
`

const HeaderRow = styled(RowFixed)`
  width: 100%;
  min-width: 1100px;
  padding-left: 2rem;
  align-items: flex-start
    ${({ theme }) => theme.mediaWidth.upToLarge`
    background: red
   align-items: center
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border-radius: 32px;
  white-space: nowrap;
  cursor: pointer;
  padding: ${({ active }) => (active ? '14px 16px' : 'unset')};
  padding-right: 0;
  height: 44px;
`

const UNIAmount = styled.div`
  color: ${({ theme }) => theme.bg1};
  font-size: 13px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: transparent;
  &:after {
    content: '';
    border-right: 2px solid ${({ theme }) => theme.text2};
    margin-left: 16px;
    height: 20px;
  }
`

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledLogo = styled(Logo)`
  margin-right: 60px;
`

const MobileHeader = styled.header`
  width:100%;
  display:flex;
  justify-content:space-between;
  align-items: center;
  padding: 0 24px;
  position:relative;
  background-color: ${({ theme }) => theme.bg1}
  height:${({ theme }) => theme.mobileHeaderHeight}
  position:fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: none;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    display: inherit
`};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  width: auto;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
    display: none
`};
`

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  width: fit-content;
  margin: 0 20px;
  font-weight: 400;
  padding: 10px 0 31px;
  white-space: nowrap;
  transition: 0.5s;
  border-bottom: 1px solid transparent;
  &.${activeClassName} {
    color: ${({ theme }) => theme.text1};
    border-bottom: 1px solid ${({ theme }) => theme.text1};
  }
  :hover,
  :focus {
    color: ${({ theme }) => theme.text1};
  }
`

const UserButton = styled(ButtonText)<{ isOpen: boolean }>`
  height: 44px;
  width: 44px;
  border-radius: 50%;
  background: ${({ isOpen }) =>
    isOpen
      ? `linear-gradient(360deg, #fffa8b 0%, rgba(207, 209, 86, 0) 50%),
  linear-gradient(259.57deg, #b2f355 1.58%, #66d7fa 92.54%);`
      : `linear-gradient(360deg, #66d7fa 0%, rgba(207, 209, 86, 0) 50%),
    linear-gradient(259.57deg, #66d7fa 1.58%, #66d7fa 92.54%);`};
  border: none;
  flex-shrink: 0;
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: center;
  align-items: center;
  transition: 0.4s;
  :hover,
  :focus {
    background: linear-gradient(360deg, #fffa8b 0%, rgba(207, 209, 86, 0) 50%),
      linear-gradient(259.57deg, #b2f355 1.58%, #66d7fa 92.54%);
  }
`

export default function Header() {
  const { account } = useActiveWeb3React()
  const userInfo = useCurrentUserInfo()
  const { login } = useLogin()
  const { showUserPanel, isUserPanelOpen } = useUserPanel()
  const toggleCreationModal = useToggleCreationModal()
  const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()

  const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  const onCreateOrLogin = useCallback(() => {
    if (userInfo && userInfo.token) toggleCreationModal()
    else login()
  }, [userInfo, login, toggleCreationModal])

  const toShowUserPanel = useCallback(() => {
    if (userInfo && userInfo.token) showUserPanel()
    else login()
  }, [userInfo, showUserPanel, login])

  return (
    <HeaderFrame>
      <HeaderRow>
        <Link to={'/'}>
          <StyledLogo />
        </Link>
        <HeaderLinks>
          {tabs.map(({ title, route }) => (
            <StyledNavLink to={'/' + route} key={route}>
              {title}
            </StyledNavLink>
          ))}
        </HeaderLinks>
        <div style={{ paddingLeft: 8, display: 'flex', alignItems: 'center', marginLeft: 'auto', marginRight: '2rem' }}>
          <HeaderControls>
            {account && (
              <ButtonOutlinedPrimary width="120px" marginRight="16px" height={44} onClick={onCreateOrLogin}>
                Create
              </ButtonOutlinedPrimary>
            )}

            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {!!account && aggregateBalance && (
                <UNIWrapper>
                  <UNIAmount style={{ pointerEvents: 'none' }}>
                    {account && (
                      <TYPE.gray
                        style={{
                          paddingRight: '.4rem'
                        }}
                      >
                        <CountUp
                          key={countUpValue}
                          isCounting
                          start={parseFloat(countUpValuePrevious)}
                          end={parseFloat(countUpValue)}
                          thousandsSeparator={','}
                          duration={1}
                        />
                      </TYPE.gray>
                    )}
                    MATTER
                  </UNIAmount>
                </UNIWrapper>
              )}
              <Web3Status />
              <UserButton onClick={toShowUserPanel} isOpen={isUserPanelOpen}>
                <AntimatterIcon />
              </UserButton>
            </AccountElement>
          </HeaderControls>
        </div>
      </HeaderRow>
      <MobileHeader>
        <RowBetween>
          <Link to={'/'}>
            <StyledLogo />
          </Link>
          <ToggleMenu />
        </RowBetween>
      </MobileHeader>

      <CreationNFTModal />
    </HeaderFrame>
  )
}
