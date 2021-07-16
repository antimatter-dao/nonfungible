import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import ModalOverlay from 'components/Modal/ModalOverlay'
import AppBody from 'pages/AppBody'
import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import { ButtonOutlinedBlack } from 'components/Button'
import { TYPE } from 'theme'
import CopyHelper from 'components/AccountDetails/Copy'
import { dummyData } from 'pages/SportIndex'
import NFTCard from 'components/NFTCard'
import Table, { OwnerCell } from 'components/Table'
import { ReactComponent as Buy } from 'assets/svg/buy.svg'
import { ReactComponent as Send } from 'assets/svg/send.svg'
import { ReactComponent as Sell } from 'assets/svg/sell.svg'
import { ReactComponent as Claim } from 'assets/svg/claim.svg'
import { ReactComponent as Settings } from 'assets/svg/settings.svg'
import { ReactComponent as LogOut } from 'assets/svg/log_out.svg'
import ProfileSetting from './ProfileSetting'

enum Tabs {
  POSITION = 'My Position',
  INDEX = 'My Index',
  LOCKER = 'My Locker',
  ACTIVITY = 'Activity'
}

enum Actions {
  BUY = 'Buy',
  SELL = 'Sell',
  CLAIM = 'Claim',
  SEND = 'Send'
}

const ActionIcons = {
  [Actions.BUY]: <Buy />,
  [Actions.SELL]: <Sell />,
  [Actions.SEND]: <Send />,
  [Actions.CLAIM]: <Claim />
}

const ContentWrapper = styled.div`
  position: relative;
  margin: auto;
  display: grid;
  width: 100%;
  grid-gap: 12px;
  grid-template-columns: repeat(auto-fill, 280px);
  padding-bottom: 52px;
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToLarge`padding: 30px`}
  ${({ theme }) => theme.mediaWidth.upToSmall`padding: 10px`}
`

const Wrapper = styled.div`
  padding: 78px 0;
  width: 90vw;
  max-width: 1284px;
  display: flex;
  justify-content: center;
`

const ProfileImg = styled.div<{ url?: string }>`
  height: 68px;
  width: 68px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
  background: #000000 ${({ url }) => (url ? `url(${url})` : '')};
`

const Capsule = styled.p`
  padding: 5px 10px
  border: 1px solid #000000;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 400;
  margin-left: 12px
`

const Synopsis = styled.p`
  max-width: 741px;
`

const SwitchTabWrapper = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.text2};
`

const Tab = styled.button<{ selected: boolean }>`
  border: none;
  background: none;
  padding: 14px 0;
  margin-right: 40px;
  font-size: 16px;
  font-weight: 700;
  color: ${({ selected, theme }) => (selected ? '#000000' : theme.text2)};
  border-bottom: 3px solid ${({ selected }) => (selected ? '#000000' : 'transparent')};
  margin-bottom: -1px;
  transition: 0.5s;
`

function ActionButton({ onClick }: { onClick: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <ButtonOutlinedBlack key="1" width="120px" onClick={onClick}>
        Claim Fees
      </ButtonOutlinedBlack>
    </div>
  )
}

function ActionCell({ action }: { action: Actions }) {
  return (
    <>
      {ActionIcons[action]}
      {action}
    </>
  )
}

const dummyIndexData = [
  ['121', 'Defi', '121', '12 MATTER'],
  ['121', 'Defi', '121', '12 MATTER'],
  ['121', 'Defi', '121', '12 MATTER', <ActionButton onClick={() => {}} key="1" />],
  ['121', 'Defi', '121', '12 MATTER']
]

const dummyActivityData = [
  [
    'Sport Index',
    '121',
    <ActionCell action={Actions.BUY} key="1" />,
    <OwnerCell name="2living0zen" key="1" />,
    '1 day ago'
  ],
  [
    'Sport Index',
    '121',
    <ActionCell action={Actions.SELL} key="2" />,
    <OwnerCell name="2living0zen" key="2" />,
    '1 day ago'
  ],
  [
    'Sport Index',
    '121',
    <ActionCell action={Actions.SEND} key="3" />,
    <OwnerCell name="2living0zen" key="3" />,
    '1 day ago'
  ],
  [
    'Sport Index',
    '121',
    <ActionCell action={Actions.CLAIM} key="4" />,
    <OwnerCell name="2living0zen" key="4" />,
    '1 day ago'
  ]
]
export default function User({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  const [currentTab, setCurrentTab] = useState(Tabs.POSITION)
  const [showSetting, setShowSetting] = useState(false)
  const handleTabClick = useCallback(
    tab => () => {
      setCurrentTab(tab)
    },
    []
  )
  const handleHideSetting = useCallback(() => {
    setShowSetting(false)
  }, [])
  const handleShowSetting = useCallback(() => {
    setShowSetting(true)
  }, [])
  const handleLogOut = useCallback(() => {}, [])

  return (
    <>
      <ProfileSetting isOpen={showSetting} onDismiss={handleHideSetting} />
      <ModalOverlay isOpen={isOpen} onDismiss={onDismiss}>
        <Wrapper>
          <AppBody maxWidth="1284px" style={{ width: '100%', padding: 52 }} isCard>
            <AutoColumn gap="40px">
              <AutoColumn>
                <RowBetween>
                  <AutoRow gap="12px" style={{ width: 'auto' }}>
                    <ProfileImg />
                    <AutoColumn>
                      <RowFixed>
                        <TYPE.black>Unnamed</TYPE.black>
                        <Capsule>#1234</Capsule>
                      </RowFixed>
                      <TYPE.smallGray>
                        <AutoRow>
                          0xKos369cd6vwd94wq1gt4hr87ujv <CopyHelper toCopy={'0xKos369cd6vwd94wq1gt4hr87ujv'} />
                        </AutoRow>
                      </TYPE.smallGray>
                    </AutoColumn>
                  </AutoRow>
                  <RowFixed>
                    <ButtonOutlinedBlack width="134px" marginRight="12px" onClick={handleShowSetting}>
                      <Settings style={{ marginRight: 15 }} />
                      Settings
                    </ButtonOutlinedBlack>
                    <ButtonOutlinedBlack width="134px" onClick={handleLogOut}>
                      <LogOut style={{ marginRight: 15 }} /> Log Out
                    </ButtonOutlinedBlack>
                  </RowFixed>
                </RowBetween>
                <Synopsis>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam. Quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </Synopsis>
              </AutoColumn>
              <SwitchTab onTabClick={handleTabClick} currentTab={currentTab} />
              {(currentTab === Tabs.POSITION || currentTab === Tabs.LOCKER) && (
                <ContentWrapper>
                  {dummyData.map(({ color, address, icons, indexId, creator, name, id }) => (
                    <NFTCard
                      id={id}
                      color={color}
                      address={address}
                      icons={icons}
                      indexId={indexId}
                      key={indexId}
                      creator={creator}
                      name={name}
                      onClick={() => {}}
                    />
                  ))}
                </ContentWrapper>
              )}
              {currentTab === Tabs.INDEX && (
                <Table
                  header={['IndexId', 'Index Name', 'Current Issurance', 'Fees Earned', '']}
                  rows={dummyIndexData}
                  isHeaderGray
                />
              )}
              {currentTab === Tabs.ACTIVITY && (
                <Table
                  header={['Catagory', 'IndexId', 'Action', 'Owner', 'Date']}
                  rows={dummyActivityData}
                  isHeaderGray
                />
              )}
            </AutoColumn>
          </AppBody>
        </Wrapper>
      </ModalOverlay>
    </>
  )
}

function SwitchTab({ currentTab, onTabClick }: { currentTab: Tabs; onTabClick: (tab: Tabs) => () => void }) {
  return (
    <SwitchTabWrapper>
      {Object.keys(Tabs).map(tab => {
        const tabName = Tabs[tab as keyof typeof Tabs]
        return (
          <Tab key={tab} onClick={onTabClick(tabName)} selected={currentTab === tabName}>
            {tabName}
          </Tab>
        )
      })}
    </SwitchTabWrapper>
  )
}
