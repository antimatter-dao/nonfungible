import { ChainId, TokenAmount } from '@uniswap/sdk'
import React, { useCallback, useState } from 'react'
import { Link, NavLink, useHistory, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { Check } from 'react-feather'
import { darken } from 'polished'
// import { useTranslation } from 'react-i18next'
import { CountUp } from 'use-count-up'
import { useActiveWeb3React } from '../../hooks'
import { useAggregateUniBalance, useETHBalances } from '../../state/wallet/hooks'
import { ButtonText, ExternalLink, TYPE } from '../../theme'
import Row, { RowFixed, RowBetween } from '../Row'
import Web3Status from '../Web3Status'
import usePrevious from '../../hooks/usePrevious'
import { ReactComponent as Logo } from '../../assets/svg/antimatter_logo.svg'
import ToggleMenu from './ToggleMenu'
import { ButtonOutlinedPrimary } from 'components/Button'
import { ReactComponent as AntimatterIcon } from 'assets/svg/antimatter_icon.svg'
import { useToggleCreationModal, useWalletModalToggle } from 'state/application/hooks'
import CreationNFTModal from 'components/Creation'
import { useCurrentUserInfo, useLogin, useLogOut } from 'state/userInfo/hooks'
import { shortenAddress } from 'utils'
import { AutoColumn } from 'components/Column'
import Copy from 'components/AccountDetails/Copy'
import { UserInfoTabRoute, UserInfoTabs } from 'pages/User'
import { ChevronDown } from 'react-feather'
import { ReactComponent as BSCInvert } from '../../assets/svg/binance.svg'
import { ReactComponent as ETH } from '../../assets/svg/eth_logo.svg'
import { useWeb3React } from '@web3-react/core'
import { Modal } from '@material-ui/core'

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
  { title: 'Locker', route: 'locker' },
  { title: 'Collectables', route: 'collectables' },
  { title: 'Governance', link: 'https://governance.antimatter.finance/' }
]

const NetworkInfo: {
  [key: number]: { title: string; color: string; icon: JSX.Element; link?: string; linkIcon?: JSX.Element }
} = {
  1: {
    color: '#FFFFFF',
    icon: <ETH />,
    link: 'https://app.antimatter.finance',
    title: 'ETH'
  },
  56: {
    color: '#F0B90B',
    icon: <BSCInvert />,
    link: 'https://app.antimatter.finance',
    title: 'BSC'
  }
}

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
  z-index: 6;
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
  padding: ${({ active }) => (active ? '14px 16px' : 'unset')};
  padding-right: 0;
  height: 44px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  width:100%`}
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
  color: ${({ theme }) => theme.text4};
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
const StyledExternalLink = styled(ExternalLink)`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text4};
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

const UserButtonWrap = styled.div`
  position: relative;
  :hover {
    #userButton {
      :hover,
      :focus {
        background: linear-gradient(360deg, #fffa8b 0%, rgba(207, 209, 86, 0) 50%),
          linear-gradient(259.57deg, #b2f355 1.58%, #66d7fa 92.54%);
      }
    }
    div {
      opacity: 1;
      visibility: visible;
    }
  }
  div {
    opacity: 0;
    visibility: hidden;
  }
`

const UserButton = styled(ButtonText)<{ isOpen: boolean; size?: string }>`
  height: ${({ size }) => size ?? '44px'};
  width: ${({ size }) => size ?? '44px'};
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
  :disabled {
    cursor: auto;
  }
  :hover {
    background: linear-gradient(360deg, #fffa8b 0%, rgba(207, 209, 86, 0) 50%),
      linear-gradient(259.57deg, #b2f355 1.58%, #66d7fa 92.54%);
  }
`

const UserMenuWrapper = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  z-index: 2000;
  min-width: 15rem;
  box-sizing: border-box;
  background-color: #ffffff;
  overflow: hidden;
  border-radius: 16px;
  transition-duration: 0.3s;
  transition-property: visibility, opacity;
  display: flex;
  border: 1px solid #ededed;
  flex-direction: column;
  & > div:first-child {
    padding: 16px 24px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ededed;
    width: 100%;
  }
  & > button:last-child {
    padding: 16px 24px;
    border-top: 1px solid #ededed;
  }
`

const UserMenuItem = styled.button`
  padding: 12px 24px;
  width: 100%;
  border: none;
  background-color: transparent;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
  :hover {
    background-color: #ededed;
  }
`
const HeaderElement = styled.div<{
  show?: boolean
}>`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
  & > div {
    border: 1px solid ${({ theme, show }) => (show ? theme.text1 : 'transparent')};
    border-radius: 4px;
    height: 32px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    font-size: 13px;
  }
`

const NetworkCard = styled.div<{ color?: string }>`
  color: #000000;
  cursor: pointer;
  display: flex;
  padding: 0 4px;
  height: 32px;
  margin-right: 12px;
  margin-left: 19px;
  justify-content: center;
  border-radius: 4px;
  align-items: center;
  background-color: ${({ color }) => color ?? 'rgba(255, 255, 255, 0.12)'}
  font-size: 13px;
  font-weight: 500;
  position: relative;
  & > svg:first-child {
    height: 20px;
    width: 20px;
  }
  .dropdown_wrapper {
    &>div{
      a {
        padding: 12px 12px 12px 44px ;
      }
    }
  }
  :hover {
    cursor: pointer;
    .dropdown_wrapper {
      top: 100%;
      left: -20px;
      height: 10px;
      position: absolute;
      width: 172px;
      &>div{
        height: auto;
        margin-top: 10px;
        border: 1px solid ${({ theme }) => theme.text5};
        a{
          position: relative;
          & >svg{
            height: 20px;
            width: 20px;
            margin-right: 15px;
          }
        }
      }
    }
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0
  `};
`

const Dropdown = styled.div`
  z-index: 3;
  height: 0;
  position: absolute;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 172px;
  > div {
    color: #ffffff;
    background-color: ${({ theme }) => theme.bg2};
    text-decoration: none;
    padding: 14px 17px;
    border-bottom: 1px solid ${({ theme }) => theme.text5};
    transition: 0.5s;
    display: flex;
    align-items: center;
    padding-left: 35px;
    > svg {
      width: 26px;
      height: 26px;
      margin-right: 5px;
    }
    :last-child {
      border: none;
    }
    :hover {
      background-color: ${({ theme }) => theme.bg4};
      color: ${({ theme }) => darken(0.1, theme.primary1)};
    }
  }
`
const StyledModalNotice = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  width: 400px;
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%);
  background-color: #424242;
  padding: 16px 32px 24px;
  #simple-modal-description {
    font-size: 18px;
  }
  :focus-visible {
    outline: none;
  }
`
function ModalNotice({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  return (
    <Modal
      open={isOpen}
      onClose={onDismiss}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <StyledModalNotice>
        <h2 id="simple-modal-title">Tips</h2>
        <p id="simple-modal-description">Please switch to Ethereum.</p>
      </StyledModalNotice>
    </Modal>
  )
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const { library } = useWeb3React()
  const userInfo = useCurrentUserInfo()
  const { login } = useLogin()
  const match = useRouteMatch('/profile')
  const toggleCreationModal = useToggleCreationModal()
  const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()
  const ETHBalance = useETHBalances(account ? [account] : [])[account ?? '']
  const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'
  const countETHUpValue = ETHBalance?.toFixed(0) ?? '0'
  const countETHUpValuePrevious = usePrevious(countETHUpValue) ?? '0'
  const [netNotice, setNetNotice] = useState(false)
  const onCreateOrLogin = useCallback(() => {
    if (userInfo && userInfo.token) toggleCreationModal()
    else login()
  }, [userInfo, login, toggleCreationModal])

  const toShowUserPanel = useCallback(() => {
    if (userInfo && userInfo.token) return
    else login()
  }, [userInfo, login])

  return (
    <HeaderFrame>
      <HeaderRow>
        <Link to={'/'}>
          <StyledLogo />
        </Link>
        <HeaderLinks>
          {tabs.map(({ title, route, link }) => {
            if (route) {
              return (
                <StyledNavLink to={'/' + route} key={route}>
                  {title}
                </StyledNavLink>
              )
            }
            if (link) {
              return (
                <StyledExternalLink href={link} key={link}>
                  {title}
                </StyledExternalLink>
              )
            }
            return null
          })}
        </HeaderLinks>
        <div style={{ paddingLeft: 8, display: 'flex', alignItems: 'center', marginLeft: 'auto', marginRight: '2rem' }}>
          <HeaderControls>
            <HeaderElement show={!!account}>
              {chainId && NetworkInfo[chainId] && (
                <NetworkCard title={NetworkInfo[chainId].title} color={NetworkInfo[chainId as number]?.color}>
                  {NetworkInfo[chainId as number]?.icon} {NetworkInfo[chainId].title}
                  <ChevronDown size={18} style={{ marginLeft: '5px' }} />
                  <div className="dropdown_wrapper">
                    <Dropdown>
                      {Object.keys(NetworkInfo).map(key => {
                        const info = NetworkInfo[parseInt(key) as keyof typeof NetworkInfo]
                        if (!info) {
                          return null
                        }
                        return (
                          <div
                            key={info.title}
                            onClick={() => {
                              if (
                                info.title === 'BSC' &&
                                chainId !== 56 &&
                                library &&
                                library.provider &&
                                library.provider.request
                              ) {
                                library.provider.request({
                                  method: 'wallet_addEthereumChain',
                                  params: [
                                    {
                                      chainId: `0x${Number(56).toString(16)}`,
                                      chainName: 'Binance Smart Chain Mainnet',
                                      nativeCurrency: {
                                        name: 'BNB',
                                        symbol: 'BNB',
                                        decimals: 18
                                      },
                                      rpcUrls: [
                                        'https://bsc-dataseed3.binance.org',
                                        'https://bsc-dataseed1.binance.org',
                                        'https://bsc-dataseed2.binance.org'
                                      ],
                                      blockExplorerUrls: ['https://bscscan.com/']
                                    }
                                  ]
                                })
                              } else if (chainId !== 1 && info.title === 'ETH') {
                                setNetNotice(true)
                              }
                            }}
                          >
                            {parseInt(key) === chainId && (
                              <span style={{ position: 'absolute', left: '15px' }}>
                                <Check size={18} />
                              </span>
                            )}
                            {info.linkIcon ?? info.icon}
                            {info.title}
                          </div>
                        )
                      })}
                    </Dropdown>
                  </div>
                </NetworkCard>
              )}
            </HeaderElement>
            {account && (
              <ButtonOutlinedPrimary width="120px" marginRight="16px" height={44} onClick={onCreateOrLogin}>
                Create
              </ButtonOutlinedPrimary>
            )}

            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {chainId !== ChainId.BSC && !!account && aggregateBalance && (
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
              {chainId === ChainId.BSC && !!account && ETHBalance && (
                <UNIWrapper>
                  <UNIAmount style={{ pointerEvents: 'none' }}>
                    {account && (
                      <TYPE.gray
                        style={{
                          paddingRight: '.4rem'
                        }}
                      >
                        <CountUp
                          key={countETHUpValue}
                          isCounting
                          start={parseFloat(countETHUpValuePrevious)}
                          end={parseFloat(countETHUpValue)}
                          thousandsSeparator={','}
                          duration={1}
                        />
                      </TYPE.gray>
                    )}
                    BNB
                  </UNIAmount>
                </UNIWrapper>
              )}
              <Web3Status />
              {userInfo && userInfo.token ? (
                <UserButtonWrap>
                  <UserButton id="userButton" onClick={toShowUserPanel} isOpen={!!match}>
                    <AntimatterIcon />
                  </UserButton>
                  <UserMenu account={account} />
                </UserButtonWrap>
              ) : (
                account && (
                  <UserButton onClick={toShowUserPanel} isOpen={!!match}>
                    <AntimatterIcon />
                  </UserButton>
                )
              )}
            </AccountElement>
          </HeaderControls>
        </div>
      </HeaderRow>
      <MobileHeader>
        <RowBetween>
          <Link to={'/'}>
            <StyledLogo />
          </Link>
          <ToggleMenu onCreate={onCreateOrLogin} />
        </RowBetween>
      </MobileHeader>

      <CreationNFTModal />
      <ModalNotice
        isOpen={netNotice}
        onDismiss={() => {
          setNetNotice(false)
        }}
      />
    </HeaderFrame>
  )
}

function UserMenu({ account }: { account?: string | null }) {
  const history = useHistory()
  const logout = useLogOut()
  const toggleWalletModal = useWalletModalToggle()

  return (
    <UserMenuWrapper>
      <div>
        <UserButton isOpen={true} disabled size="28px">
          <AntimatterIcon />
        </UserButton>
        <TYPE.darkGray fontWeight={400} style={{ marginLeft: 15 }}>
          {account && shortenAddress(account)}
        </TYPE.darkGray>
        {account && <Copy toCopy={account} fixedSize />}
      </div>
      <div>
        <AutoColumn style={{ width: '100%' }}>
          <UserMenuItem onClick={() => history.push('/profile/' + UserInfoTabs.POSITION)}>
            {UserInfoTabRoute[UserInfoTabs.POSITION]}
          </UserMenuItem>
          <UserMenuItem onClick={() => history.push('/profile/' + UserInfoTabs.INDEX)}>
            {UserInfoTabRoute[UserInfoTabs.INDEX]}
          </UserMenuItem>
          <UserMenuItem onClick={() => history.push('/profile/' + UserInfoTabs.LOCKER)}>
            {UserInfoTabRoute[UserInfoTabs.LOCKER]}
          </UserMenuItem>
          <UserMenuItem onClick={toggleWalletModal}>Wallet</UserMenuItem>
          <UserMenuItem onClick={() => history.push('/profile/settings')}>Settings</UserMenuItem>
        </AutoColumn>
      </div>
      <UserMenuItem onClick={logout}>Logout</UserMenuItem>
    </UserMenuWrapper>
  )
}
