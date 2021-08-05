import React, { useCallback, useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import AppBody from 'pages/AppBody'
import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import { ButtonOutlinedBlack } from 'components/Button'
import { TYPE } from 'theme'
import CopyHelper from 'components/AccountDetails/Copy'
import ProfileFallback from 'assets/images/profile-fallback.png'
import NFTCard from 'components/NFTCard'
import Table /*, { OwnerCell }*/ from 'components/Table'
// import { ReactComponent as Buy } from 'assets/svg/buy.svg'
// import { ReactComponent as Send } from 'assets/svg/send.svg'
// import { ReactComponent as Sell } from 'assets/svg/sell.svg'
// import { ReactComponent as Claim } from 'assets/svg/claim.svg'
import { ReactComponent as Settings } from 'assets/svg/settings.svg'
import { ReactComponent as LogOut } from 'assets/svg/log_out.svg'
import ProfileSetting from './ProfileSetting'
import { useCurrentUserInfo, useLogOut } from 'state/userInfo/hooks'
import { usePositionList, useIndexList } from 'hooks/useMyList'
import { useHistory, useParams, useLocation } from 'react-router-dom'

export enum UserInfoTabs {
  POSITION = 'my_position',
  INDEX = 'my_index'
  // LOCKER = 'My Locker',
  // ACTIVITY = 'Activity'
}

export const UserInfoTabRoute = {
  [UserInfoTabs.POSITION]: 'My Position',
  [UserInfoTabs.INDEX]: 'My Index'
}

// enum Actions {
//   BUY = 'Buy',
//   SELL = 'Sell',
//   CLAIM = 'Claim',
//   SEND = 'Send'
// }

// const ActionIcons = {
//   [Actions.BUY]: <Buy />,
//   [Actions.SELL]: <Sell />,
//   [Actions.SEND]: <Send />,
//   [Actions.CLAIM]: <Claim />
// }

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
  min-height: 100vh;
`

const ProfileImg = styled.div<{ url?: string }>`
  height: 68px;
  width: 68px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
  background: ${({ url }) => (url ? `url(${url})` : `url(${ProfileFallback})`)};
`

const Capsule = styled.p`
  padding: 5px 10px;
  border: 1px solid #000000;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 400;
  margin-left: 12px;
`

const Synopsis = styled.p`
  max-width: 741px;
  overflow-wrap: anywhere;
  margin-top: 30px;
  width: 100%;
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
  transition: 0.3s;
`

// function ActionButton({ onClick }: { onClick: () => void }) {
//   return (
//     <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//       <ButtonOutlinedBlack key="1" width="120px" onClick={onClick}>
//         Claim Fees
//       </ButtonOutlinedBlack>
//     </div>
//   )
// }

// function ActionCell({ action }: { action: Actions }) {
//   return (
//     <>
//       {ActionIcons[action]}
//       {action}
//     </>
//   )
// }

// const dummyActivityData = [
//   [
//     'Sport Index',
//     '121',
//     <ActionCell action={Actions.BUY} key="1" />,
//     <OwnerCell name="2living0zen" key="1" />,
//     '1 day ago'
//   ],
//   [
//     'Sport Index',
//     '121',
//     <ActionCell action={Actions.SELL} key="2" />,
//     <OwnerCell name="2living0zen" key="2" />,
//     '1 day ago'
//   ],
//   [
//     'Sport Index',
//     '121',
//     <ActionCell action={Actions.SEND} key="3" />,
//     <OwnerCell name="2living0zen" key="3" />,
//     '1 day ago'
//   ],
//   [
//     'Sport Index',
//     '121',
//     <ActionCell action={Actions.CLAIM} key="4" />,
//     <OwnerCell name="2living0zen" key="4" />,
//     '1 day ago'
//   ]
// ]
export default function User() {
  const history = useHistory()
  const { tab } = useParams<{ tab: string }>()
  const location = useLocation()
  const [currentTab, setCurrentTab] = useState(UserInfoTabs.POSITION)
  const [showSetting, setShowSetting] = useState(false)
  const userInfo = useCurrentUserInfo()
  const positionCardList = usePositionList(userInfo)
  const indexList = useIndexList(userInfo)
  const logout = useLogOut()
  const handleTabClick = useCallback(
    tab => () => {
      setCurrentTab(tab)
      history.push('/profile/' + tab)
    },
    [history]
  )
  const handleHideSetting = useCallback(() => {
    setShowSetting(false)
  }, [])
  const handleShowSetting = useCallback(() => {
    setShowSetting(true)
  }, [])

  const handleLogOut = useCallback(() => {
    logout()
  }, [logout])

  const indexData = useMemo(
    () =>
      indexList.map(({ indexId, indexName }) => [
        indexId,
        indexName,
        '',
        '0.05eth'
        // <ActionButton onClick={() => {}} key={indexId} />
      ]),
    [indexList]
  )

  useEffect(() => {
    tab && UserInfoTabRoute[tab as keyof typeof UserInfoTabRoute] && setCurrentTab(tab as UserInfoTabs)
  }, [location, tab])

  return (
    <>
      <ProfileSetting isOpen={showSetting} onDismiss={handleHideSetting} userInfo={userInfo} />
      <Wrapper>
        <AppBody maxWidth="1284px" style={{ width: '100%', padding: 52 }} isCard>
          <AutoColumn gap="40px">
            <AutoColumn>
              <RowBetween>
                <AutoRow gap="12px" style={{ width: 'auto' }}>
                  <ProfileImg />
                  <AutoColumn>
                    <RowFixed>
                      <TYPE.black fontSize={28}>{userInfo?.username}</TYPE.black>
                      <Capsule>#{userInfo?.id}</Capsule>
                    </RowFixed>
                    <TYPE.darkGray>
                      <AutoRow>
                        {userInfo?.account} <CopyHelper toCopy={userInfo?.account ?? ''} />
                      </AutoRow>
                    </TYPE.darkGray>
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
              <Synopsis>{userInfo?.bio}</Synopsis>
            </AutoColumn>
            <SwitchTab onTabClick={handleTabClick} currentTab={currentTab} />
            {currentTab === UserInfoTabs.POSITION /*|| currentTab === Tabs.LOCKER*/ && (
              <ContentWrapper>
                {positionCardList.length === 0 ? (
                  <span>You have no NFT at the moment</span>
                ) : (
                  positionCardList.map(item => {
                    if (!item) return null
                    const { color, address, icons, indexId, creator, name, id } = item
                    return (
                      <NFTCard
                        id={id}
                        color={color}
                        address={address}
                        icons={icons}
                        indexId={indexId}
                        key={indexId + id}
                        creator={creator}
                        name={name}
                        onClick={() => {
                          history.push(`/spot_detail/${indexId}`)
                        }}
                      />
                    )
                  })
                )}
              </ContentWrapper>
            )}
            {currentTab === UserInfoTabs.INDEX && (
              <Table
                header={['Index ID', 'Index Name', 'Current Issurance', 'Fees Earned', '']}
                rows={indexData}
                isHeaderGray
              />
            )}
            {/* {currentTab === Tabs.ACTIVITY && (
                <Table
                  header={['Catagory', 'IndexId', 'Action', 'Owner', 'Date']}
                  rows={dummyActivityData}
                  isHeaderGray
                />
              )} */}
          </AutoColumn>
        </AppBody>
      </Wrapper>
    </>
  )
}

function SwitchTab({
  currentTab,
  onTabClick
}: {
  currentTab: UserInfoTabs
  onTabClick: (tab: UserInfoTabs) => () => void
}) {
  return (
    <SwitchTabWrapper>
      {Object.keys(UserInfoTabRoute).map(tab => {
        const tabName = UserInfoTabRoute[tab as keyof typeof UserInfoTabRoute]
        return (
          <Tab key={tab} onClick={onTabClick(tab as UserInfoTabs)} selected={currentTab === tab}>
            {tabName}
          </Tab>
        )
      })}
    </SwitchTabWrapper>
  )
}
