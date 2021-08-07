import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
// import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import ComingSoon from './ComingSoon'

import { RedirectPathToSwapOnly } from './SpotIndex/redirects'
// import Governance from './NFTGovernance'
import SpotIndex from './SpotIndex'
import GovernanceDetail from './NFTGovernance/NFTGovernanceDetail'
// import Locker from './Locker'
import CardDetail from './CardDetail'
import UserLogin from '../pages/User/Login'
import User from './User'
import WarningModal from 'components/Modal/WarningModal'

const AppWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.bg1};
  min-height: 100vh;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  height: 100vh;
  `}
`
const ContentWrapper = styled.div`
  width: 100%;
  max-height: 100vh;
  overflow: auto;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    overflow-x:hidden;
  `}
`

const HeaderWrapper = styled.div`
  width: 100%;
  z-index: 10;
  justify-content: space-between;
  flex-direction: column;
  ${({ theme }) => theme.flexRowNoWrap};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  height:0;
  overflow: hidden
  `}
  position: fixed;
`

const HeaderFiller = styled.div`
  height: ${({ theme }) => theme.headerHeight};
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - ${({ theme }) => theme.headerHeight});
  justify-content: center;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin-bottom: ${({ theme }) => theme.headerHeight};
  `}
  ${({ theme }) => theme.mediaWidth.upToLarge`
  margin-bottom: ${({ theme }) => theme.headerHeight};
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  display: none
  margin-top: ${({ theme }) => theme.mobileHeaderHeight};
  `};
`

const MobileHint = styled.div`
  display: none;
  color: #ffffff;
  margin: 100px auto auto;
  width: 300px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  display: block;
  `};
`

export const Marginer = styled.div`
  ${({ theme }) => theme.desktop};
`

// function TopLevelModals() {
//   const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
//   const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
//   return <AddressClaimModal isOpen={open} onDismiss={toggle} />
// }

export default function App() {
  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <Route component={UserLogin} />
      <AppWrapper id="app">
        {/* <URLWarning /> */}

        <ContentWrapper>
          <HeaderWrapper id="header">
            <Header />
          </HeaderWrapper>
          <HeaderFiller />
          <MobileHint>
            Sorry, this app is currently unavailable on mobile. Please visit our desktop website to use the service.
          </MobileHint>
          <BodyWrapper id="body">
            <Popups />
            <Polling />
            <WarningModal />
            {/* <TopLevelModals /> */}
            <Web3ReactManager>
              <Switch>
                <Route exact strict path="/" component={SpotIndex} />
                <Route exact strict path="/spot_index" component={SpotIndex} />
                <Route exact strict path="/spot_detail/:nftid" component={CardDetail} />
                <Route exact strict path="/collectables" component={ComingSoon} />
                {/* <Route exact strict path="/locker" component={Locker} /> */}
                <Route exact strict path="/locker" component={ComingSoon} />
                {/* <Route exact strict path="/governance" component={Governance} /> */}
                <Route exact strict path="/governance" component={ComingSoon} />
                <Route exact strict path="/governance/:governanceIndex" component={GovernanceDetail} />
                <Route strict path="/profile/:tab" component={User} />
                <Route strict path="/profile" component={User} />
                <Route component={RedirectPathToSwapOnly} />
              </Switch>
            </Web3ReactManager>
            {/* <Marginer /> */}
          </BodyWrapper>
        </ContentWrapper>
      </AppWrapper>
    </Suspense>
  )
}
