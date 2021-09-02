import React from 'react'
import styled, { keyframes } from 'styled-components'
import { TYPE } from 'theme'
import { ReactComponent as BoxBottom } from 'assets/svg/box_bottom.svg'
import BoxSlabUrl from 'assets/svg/box_slab.svg'
import AppBody from 'pages/AppBody'
import { TimerCapsule } from 'components/NFTCard/Capsule'
import { HideMedium } from 'theme'
import { RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { ButtonBlack } from 'components/Button'
import { OutlineCard } from 'components/Card'
import { SwitchTabWrapper, Tab } from 'components/SwitchTab'
import gradient from 'assets/svg/overlay_gradient.svg'

const Wrapper = styled.div`
  width: 100%;
  margin-top: 60px;
  min-height: ${({ theme }) => `calc(100vh - ${theme.headerHeight})`};
  background #000000 url(${gradient}) 0 50px no-repeat;
  display: flex;
  align-items: center;
  flex-direction: column; 
`

const FormWrapper = styled.div`
  width: 100%
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  margin-top: 80px;
  align-items: center
`

const bounceAnimation = keyframes`
 0% {transform(0)}
 100% {transform:translateY(-20px) }
`
const breatheAnimation = keyframes`
 0% {transform:scale(1)}
 100% {transform:scale(0.1)}
`
const AnimatedLight = styled.div`
  width: 50%;
  height: 50%;
  left: 40%;
  top: 10%;
  left: 25%;
  position: absolute;
  background: radial-gradient(50% 50% at 50% 50%, #d3f355 0%, rgba(255, 255, 255, 0.75) 100%);
  filter: blur(200px);
  border-radius: 50%;
  transform-origin: 50% 50%;
  animation: ${breatheAnimation} 1.6s infinite alternate ease-out;
  animation-delay: 0.3s;
`

const AnimatedSlab = styled.img`
  position: absolute;
  top: -57px;
  left: 185px;
  animation: ${bounceAnimation} 1.6s infinite alternate cubic-bezier(0.175, 0.885, 0.32, 1.275);
`

const AnimationWrapper = styled.div`
  position: relative;
`

const CardWrapper = styled(AutoColumn)`
width: 100%
max-width: 1240px;
`

const CardGrid = styled.div`
  display: grid;
`

export default function Box() {
  return (
    <Wrapper>
      <TYPE.largeHeader color="#ffffff" fontSize={48} style={{ width: '100%' }} textAlign="center">
        Art meets Finance
      </TYPE.largeHeader>
      <FormWrapper>
        <HideMedium>
          <AnimationWrapper>
            <BoxBottom />
            <AnimatedLight />
            <AnimatedSlab src={BoxSlabUrl} alt="" />
          </AnimationWrapper>
        </HideMedium>
        <AppBody maxWidth="520px" style={{ marginBottom: 100, padding: 36 }}>
          <AutoColumn gap="46px">
            <div>
              <RowBetween>
                <TYPE.black fontWeight={700} fontSize={30}>
                  Antimatter NFT
                </TYPE.black>
                <TYPE.black fontWeight={400} fontSize={24}>
                  Phase #1
                </TYPE.black>
              </RowBetween>
              <TimerCapsule timeLeft={1630577914} />
            </div>
            <div>
              <OutlineCard color="#dddddd">
                <RowBetween>
                  <TYPE.black fontWeight={400}>Price per Box</TYPE.black>
                  <TYPE.black fontWeight={400}>10 MATTER</TYPE.black>
                </RowBetween>
              </OutlineCard>
              <TYPE.smallGray marginTop="8px">1 box for 1 contract address</TYPE.smallGray>
            </div>
            <ButtonBlack>Buy</ButtonBlack>
          </AutoColumn>
        </AppBody>
      </FormWrapper>
      <CardWrapper>
        <SwitchTabWrapper isWhite>
          <Tab key={'live'} onClick={() => {}} selected={true} isWhite>
            Live Box
          </Tab>
          <CardGrid></CardGrid>
        </SwitchTabWrapper>
      </CardWrapper>
    </Wrapper>
  )
}
