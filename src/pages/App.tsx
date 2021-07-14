import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
// import AddressClaimModal from '../components/claim/AddressClaimModal'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
// import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
// import { ApplicationModal } from '../state/application/actions'
// import { useModalOpen, useToggleModal } from '../state/application/hooks'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'

import { RedirectPathToSwapOnly } from './Swap/redirects'
import Generate from './Generate'
import Redeem from './Redeem'
import Info from './Info'
import FAQ from './FAQ'
import OptionTrade from './OptionTrade'
import OptionCreation from './OptionCreation'
import OptionExercise from './OptionExercise'
import Governance from './Governance'
import CardDetail from './CardDetail'
import SpotIndex from './SpotIndex'
import GovernancePageDetail from './Governance/GovernancePageDetail'

const AppWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.bg1};
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
`

const HeaderWrapper = styled.div`
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  ${({ theme }) => theme.flexRowNoWrap}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  height:0;
  overflow: hidden
  `}
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
  margin-bottom: ${({ theme }) => theme.headerHeight}
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-top: ${({ theme }) => theme.mobileHeaderHeight}
  `};
`

export const Marginer = styled.div`
  ${({ theme }) => theme.desktop}
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
      <AppWrapper id="app">
        {/* <URLWarning /> */}
        {/* <Sidebar /> */}
        <ContentWrapper>
          <HeaderWrapper id="header">
            <Header />
          </HeaderWrapper>
          <BodyWrapper id="body">
            <Popups />
            <Polling />
            {/* <WarningModal /> */}
            {/* <TopLevelModals /> */}
            <Web3ReactManager>
              <Switch>
                {/* <Route exact strict path="/option_trading" component={Swap} /> */}
                <Route exact strict path="/" component={Governance} />
                <Route exact strict path="/card_detail" component={CardDetail} />
                <Route exact strict path="/" component={SpotIndex} />
                <Route exact strict path="/spot_index" component={SpotIndex} />
                <Route exact strict path="/option_creation" component={OptionCreation} />
                <Route exact strict path="/option_trading" component={OptionTrade} />
                <Route exact strict path="/option_trading/:addressA/:addressB" component={OptionTrade} />
                <Route exact strict path="/option_exercise" component={OptionExercise} />
                <Route exact strict path="/generate/:optionTypeIndex" component={Generate} />
                <Route exact strict path="/redeem/:optionTypeIndex" component={Redeem} />
                <Route exact strict path="/governance" component={Governance} />
                <Route exact strict path="/governance/detail/:governanceIndex" component={GovernancePageDetail} />
                <Route exact strict path="/info" component={Info} />
                <Route exact strict path="/faq" component={FAQ} />
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
