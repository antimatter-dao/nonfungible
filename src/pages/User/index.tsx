import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { CurrencyAmount, JSBI } from '@uniswap/sdk'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Text } from 'rebass'
import { AutoColumn } from 'components/Column'
import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import { ButtonBlack, ButtonOutlinedBlack, ButtonOutlinedWhite } from 'components/Button'
import { AnimatedImg, AnimatedWrapper, HideSmall, TYPE, ShowSmall } from 'theme'
import CopyHelper from 'components/AccountDetails/Copy'
import ProfileFallback from 'assets/images/profile-fallback.png'
import NFTCard /*, { NFTArtCard }*/ from 'components/NFTCard'
import Table /*, { OwnerCell }*/ from 'components/Table'
// import { ReactComponent as Buy } from 'assets/svg/buy.svg'
// import { ReactComponent as Send } from 'assets/svg/send.svg'
// import { ReactComponent as Sell } from 'assets/svg/sell.svg'
// import { ReactComponent as Claim } from 'assets/svg/claim.svg'
import { ReactComponent as Settings } from 'assets/svg/settings.svg'
import { ReactComponent as LogOut } from 'assets/svg/log_out.svg'
import ProfileSetting from './ProfileSetting'
import { useCurrentUserInfo, useLogOut } from 'state/userInfo/hooks'
import { usePositionList, useIndexList, useMyLockerList } from 'hooks/useMyList'
import Pagination from 'components/Pagination'
import Loader from 'assets/svg/antimatter_background_logo_dark.svg'
import LoaderWhite from 'assets/svg/antimatter_background_logo.svg'
import ClaimModal from 'components/claim/MatterClaimModal'
import { useCreatorFee } from 'hooks/useMatterClaim'
import { SwitchTabWrapper, Tab } from 'components/SwitchTab'
import { isMobile } from 'react-device-detect'
import { shortenAddress } from 'utils'
import { useMyBlindBox } from 'hooks/useBlindBox'

export enum UserInfoTabs {
  POSITION = 'my_position',
  INDEX = 'my_index',
  LOCKER = 'my_locker',
  NFT = 'my_nfts'
  // ACTIVITY = 'Activity'
}

export const UserInfoTabRoute = {
  [UserInfoTabs.POSITION]: 'My Position',
  [UserInfoTabs.INDEX]: 'My Index',
  [UserInfoTabs.LOCKER]: 'My Locker',
  [UserInfoTabs.NFT]: 'My NFTs'
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
  ${({ theme }) => theme.mediaWidth.upToLarge`padding: 0`}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 10px;
    grid-template-columns: 100%;
  `}
`

// const ArtContentWrapper = styled.div`
//   position: relative;
//   margin: auto;
//   display: grid;
//   width: 100%;
//   grid-gap: 12px;
//   grid-template-columns: repeat(auto-fill, 280px);
//   padding-bottom: 52px;
//   justify-content: center;
//   ${({ theme }) => theme.mediaWidth.upToLarge`padding: 0`}
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//   grid-template-columns: 1fr 1fr;
// `}
//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//   padding: 10px;
//   grid-template-columns: 100%;
// `}
// `

const Wrapper = styled.div`
  padding: 78px 0 88px;
  width: 90vw;
  max-width: 1284px;
  display: flex;
  justify-content: center;
  min-height: calc(100vh - ${({ theme }) => theme.headerHeight});
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 0 0 40px;
  color: #ffffff
  width: 100%;
  `}
`

const AppBody = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 32px;
  padding: 52px;
  max-width: 1284px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  background: transparent;
  padding: 32px 24px;
  `}
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
  ${({ theme }) => theme.mediaWidth.upToSmall`
  border-color: #ffffff;
  color: #ffffff
  `}
`

const Synopsis = styled.p`
  max-width: 80%;
  overflow-wrap: anywhere;
  margin-top: 30px;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  text-align: center;
  max-width: unset;
  `}
`

const ButtonOutlined = styled(ButtonOutlinedWhite)`
  color: #ffffff;
  * {
    fill: #ffffff;
  }
`

const HeaderWrapper = styled(AutoColumn)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-content: center
  `}
`

const ProfileWrapper = styled(AutoRow)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    width: auto
  `}
`

const AddressWrapper = styled(AutoRow)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-content: center;
  `}
`

const ClaimWrapper = styled(RowBetween)`
  justify-content: flex-end;
  margin-bottom: -20px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-bottom: 20px;
  justify-content: center;
`}
`
const CardImgWrapper = styled(AutoColumn)`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  padding: 20px 20px 15px;
  background: linear-gradient(rgba(223, 249, 186, 0.5), rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 1));
  grid-gap: 10px;
  span:first-child {
    color: #000;
    font-size: 20px;
  }
  span:last-child {
    color: ${({ theme }) => theme.text3};
    font-size: 14px;
  }
  a {
    font-size: 14px;
    line-height: 133.5%;
    text-align: center;
    text-decoration-line: underline;
    color: #000000;
    opacity: 0.5;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
  span:first-child {  font-size: 16px;}
  span:last-child { font-size: 12px;}
   `}
`

const CardImg = styled.img`
  border-radius: 20px;
  width: 100%;
  min-height: 40px;
  height: auto;
`

const Divider = styled.div`
  width: 80px;
  height: 0;
  border-bottom: 1px solid ${({ theme }) => theme.text4};
  margin: 20px auto 0;
`

const NameWrapper = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0 auto;
  `}
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

function ShowNFTImage({ tokenURI }: { tokenURI: string }) {
  const [imgSrc, setImgSrc] = useState('')
  useEffect(() => {
    fetch(tokenURI)
      .then(res => res.json())
      .then(res => setImgSrc(res.image as string))
  }, [tokenURI])
  return <CardImg src={imgSrc || ''} alt="" />
}

export default function User() {
  const history = useHistory()
  const { tab } = useParams<{ tab: string }>()
  const location = useLocation()
  const [currentTab, setCurrentTab] = useState(UserInfoTabs.POSITION)
  const [showSetting, setShowSetting] = useState(false)
  const userInfo = useCurrentUserInfo()
  const { data: positionCardList, loading: positionIsLoading, page: positionPage } = usePositionList(userInfo)
  const { data: indexList, page: indexPage, loading: indexIsLoading } = useIndexList(userInfo)
  const { data: myLockerList, page: myLockerPage, loading: myLockerIsLoading } = useMyLockerList(userInfo)

  const logout = useLogOut()
  const claimFee = useCreatorFee()
  const [claimModal, setClaimModal] = useState(false)

  const handleTabClick = useCallback(
    tab => () => {
      setCurrentTab(tab)
      history.push('/profile/' + tab)
    },
    [history]
  )

  const handleHideSetting = useCallback(() => {
    setShowSetting(false)
    history.push('/profile/' + currentTab)
  }, [currentTab, history])

  const handleShowSetting = useCallback(() => {
    setShowSetting(true)
    history.push('/profile/settings')
  }, [history])

  const handleLogOut = useCallback(() => {
    logout()
  }, [logout])

  const indexData = useMemo(
    () =>
      indexList.map(({ indexId, indexName, totalNftAmount, totalCreatorFee }) => [
        indexId,
        indexName,
        totalNftAmount,
        CurrencyAmount.ether(JSBI.BigInt(totalCreatorFee ?? '')).toSignificant(6)
        // <ActionButton onClick={() => {}} key={indexId} />
      ]),
    [indexList]
  )

  useEffect(() => {
    if (tab && UserInfoTabRoute[tab as keyof typeof UserInfoTabRoute]) {
      setCurrentTab(tab as UserInfoTabs)
      setShowSetting(false)
    }
    tab && tab === 'settings' && handleShowSetting()
  }, [handleShowSetting, location, tab])

  const { ret: myMlindBoxData, loading: myMlindBoxLoading } = useMyBlindBox()

  return (
    <>
      <ProfileSetting isOpen={showSetting} onDismiss={handleHideSetting} userInfo={userInfo} />
      <Wrapper>
        <AppBody>
          <AutoColumn gap="40px">
            <HeaderWrapper>
              <RowBetween>
                <ShowSmall />
                <ProfileWrapper gap="12px">
                  <ProfileImg />
                  <AutoColumn>
                    <NameWrapper>
                      <Text fontSize={28} fontWeight={500}>
                        {userInfo?.username}
                      </Text>
                      <Capsule>#{userInfo?.id}</Capsule>
                    </NameWrapper>
                    <TYPE.darkGray fontWeight={400}>
                      <AddressWrapper>
                        {isMobile
                          ? userInfo && userInfo.account && shortenAddress(userInfo.account)
                          : userInfo?.account}{' '}
                        <CopyHelper toCopy={userInfo?.account ?? ''} />
                      </AddressWrapper>
                    </TYPE.darkGray>
                  </AutoColumn>
                </ProfileWrapper>
                <ShowSmall />
                <HideSmall>
                  <RowFixed>
                    <ButtonOutlinedBlack width="134px" marginRight="12px" onClick={handleShowSetting}>
                      <Settings style={{ marginRight: 15 }} />
                      Settings
                    </ButtonOutlinedBlack>
                    <ButtonOutlinedBlack width="134px" onClick={handleLogOut}>
                      <LogOut style={{ marginRight: 15 }} /> Log Out
                    </ButtonOutlinedBlack>
                  </RowFixed>
                </HideSmall>
              </RowBetween>
              <ShowSmall>
                <Divider />
              </ShowSmall>
              <Synopsis>{userInfo?.bio}</Synopsis>
              <ClaimWrapper>
                <AutoColumn gap="8px" justify="end">
                  <TYPE.darkGray style={{ display: 'flex', alignItems: 'center' }}>
                    Unclaim Fees: <TYPE.black fontSize={20}> {claimFee ?? '-'}</TYPE.black>
                  </TYPE.darkGray>
                  <ButtonBlack
                    width="134px"
                    disabled={!!(Number(claimFee) <= 0)}
                    onClick={() => {
                      setClaimModal(true)
                    }}
                  >
                    Claim Fees
                  </ButtonBlack>
                </AutoColumn>
              </ClaimWrapper>
              <ShowSmall style={{ justifyContent: 'center' }}>
                <RowFixed>
                  <ButtonOutlined width="134px" marginRight="12px" onClick={handleShowSetting}>
                    <Settings style={{ marginRight: 15 }} />
                    Settings
                  </ButtonOutlined>
                  <ButtonOutlined width="134px" onClick={handleLogOut}>
                    <LogOut style={{ marginRight: 15 }} /> Log Out
                  </ButtonOutlined>
                </RowFixed>
              </ShowSmall>
            </HeaderWrapper>
            <SwitchTab onTabClick={handleTabClick} currentTab={currentTab} />
            {((currentTab === UserInfoTabs.INDEX && indexIsLoading) ||
              (currentTab === UserInfoTabs.POSITION && positionIsLoading) ||
              (currentTab === UserInfoTabs.LOCKER && myLockerIsLoading) ||
              (currentTab === UserInfoTabs.NFT && myMlindBoxLoading)) && (
              <>
                <HideSmall>
                  <AnimatedWrapper style={{ marginTop: 40 }}>
                    <AnimatedImg>
                      <img src={Loader} alt="loading-icon" />
                    </AnimatedImg>
                  </AnimatedWrapper>
                </HideSmall>
                <ShowSmall>
                  <AnimatedWrapper style={{ marginTop: 40 }}>
                    <AnimatedImg>
                      <img src={LoaderWhite} alt="loading-icon" />
                    </AnimatedImg>
                  </AnimatedWrapper>
                </ShowSmall>
              </>
            )}
            {!positionIsLoading && currentTab === UserInfoTabs.POSITION /*|| currentTab === Tabs.LOCKER*/ && (
              <>
                {positionCardList.length === 0 ? (
                  <span>You have no NFT at the moment</span>
                ) : (
                  <>
                    <ContentWrapper>
                      {positionCardList.map(item => {
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
                      })}
                    </ContentWrapper>
                    {positionPage.totalPages !== 0 && (
                      <Pagination
                        page={positionPage.currentPage}
                        count={positionPage.totalPages}
                        setPage={positionPage.setCurrentPage}
                        isLightBg
                      />
                    )}
                  </>
                )}
              </>
            )}
            {!indexIsLoading && currentTab === UserInfoTabs.INDEX && (
              <>
                <Table
                  header={['Index ID', 'Index Name', 'Current Issurance', 'Fees Earned']}
                  rows={indexData}
                  isHeaderGray
                />
                {indexPage.totalPages !== 0 && (
                  <Pagination
                    page={indexPage.currentPage}
                    count={indexPage.totalPages}
                    setPage={indexPage.setCurrentPage}
                    isLightBg
                  />
                )}
              </>
            )}
            {!myLockerIsLoading && currentTab === UserInfoTabs.LOCKER /*|| currentTab === Tabs.LOCKER*/ && (
              <>
                {myLockerList.length === 0 && !myMlindBoxLoading ? (
                  <span>You have no NFT at the moment</span>
                ) : (
                  <>
                    <ContentWrapper>
                      {myLockerList.map(item => {
                        if (!item || item.indexId === undefined) return null
                        const { color, address, icons, indexId, creator, name, id } = item
                        return (
                          <NFTCard
                            createName="Locker ID"
                            id={id}
                            color={color}
                            address={address}
                            icons={icons}
                            indexId={indexId}
                            key={indexId}
                            creator={creator}
                            name={name}
                            onClick={() => {
                              history.push(`/locker/${indexId}`)
                            }}
                          />
                        )
                      })}
                    </ContentWrapper>
                    {myLockerPage.totalPages !== 0 && (
                      <Pagination
                        page={myLockerPage.currentPage}
                        count={myLockerPage.totalPages}
                        setPage={myLockerPage.setCurrentPage}
                        isLightBg
                      />
                    )}
                  </>
                )}
              </>
            )}
            {currentTab === UserInfoTabs.NFT && !myMlindBoxLoading && (
              <>
                {myMlindBoxData.length === 0 ? (
                  <span>You have no NFT at the moment</span>
                ) : (
                  <ContentWrapper style={{ justifyContent: 'flex-start' }}>
                    {myMlindBoxData.map(({ id, tokenURI }) => (
                      <CardImgWrapper key={id}>
                        <ShowNFTImage tokenURI={tokenURI} />
                        <RowBetween>
                          <RowFixed>
                            <span>#{id}&nbsp;</span>
                            <span>/66</span>
                          </RowFixed>
                          {/* <a href="/">Open in OpenSea</a> */}
                        </RowBetween>
                      </CardImgWrapper>
                    ))}
                  </ContentWrapper>
                )}
              </>
            )}
            {/* {positionCardList.length === 0 ? (
                  <span>You have no NFT at the moment</span>
                ) : (
                  <> */}
            {/* <ArtContentWrapper>
                  <NFTArtCard imgSrc="" />
                  <NFTArtCard imgSrc="" />
                  <NFTArtCard imgSrc="" />
                  <NFTArtCard imgSrc="" />
                </ArtContentWrapper> */}
            {/* {positionPage.totalPages !== 0 && (
                      <Pagination
                        page={positionPage.currentPage}
                        count={positionPage.totalPages}
                        setPage={positionPage.setCurrentPage}
                        isLightBg
                      />
                    )}
                  </>
                )} */}
            {/* </>
            )} */}

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
      <ClaimModal
        claimFee={claimFee}
        isOpen={claimModal}
        onDismiss={() => {
          setClaimModal(false)
        }}
      />
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
