import React, { useState, useMemo, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { TYPE } from 'theme'
import { ReactComponent as BoxBottom } from 'assets/svg/box_bottom.svg'
import BoxSlabUrl from 'assets/svg/box_slab.svg'
import { HideMedium, AnimatedImg, AnimatedWrapper } from 'theme'
import { AutoColumn } from 'components/Column'
import { SwitchTabWrapper, Tab } from 'components/SwitchTab'
import gradient from 'assets/svg/overlay_gradient.svg'
import DefaultBox from './DefaultBox'
import { LoadingView } from 'components/ModalViews'
import { RowFixed } from 'components/Row'
import Loader from 'assets/svg/antimatter_background_logo.svg'

const Wrapper = styled.div`
  width: 100%;
  margin-top: 60px;
  min-height: ${({ theme }) => `calc(100vh - ${theme.headerHeight})`};
  background #000000 url(${gradient}) -50px 50px no-repeat;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 40px
  ${({ theme }) => theme.mediaWidth.upToLarge`
  margin-top: 0;
  background-position: -100px bottom;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 24px
  `}
`

const AppBody = styled.div`
  max-width: 520px;
  width: 100%;
  margin-bottom: 100px;
  padding: 40px;
  background: #ffffff;
  border-radius: 30px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-bottom: 52px;
  padding: 24px 20px;
  .title{
    font-size: 24px;
  };
  .phase{
    font-size: 16px
  }
  `}
`

const FormWrapper = styled.div`
  width: 100%
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  margin-top: 80px;
  align-items: center
  ${({ theme }) => theme.mediaWidth.upToMedium`
  justify-content: center;
  margin-bottom: auto;
  margin-top: 24px;
  `}
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
  animation: ${breatheAnimation} 1.6s infinite alternate cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation-delay: 0.5s;
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
  margin-top: 60px;
  width: 100%;
  display: grid;
  grid-gap: 28px;
  row-gap: 32px
  grid-template-columns: 1fr 1fr 1fr 1fr;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  grid-template-columns: 1fr 1fr 1fr;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  grid-gap: 16px;
  grid-template-columns: 1fr 1fr;
  `}
`

const CardImgWrapper = styled(AutoColumn)`
  grid-gap: 8px;
  span:first-child {
    color: #ffffff;
    font-size: 20px;
  }
  span:last-child {
    color: ${({ theme }) => theme.text3};
    font-size: 14px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
  span:first-child {  font-size: 16px;}
  span:last-child { font-size: 12px;}
   `}
`

const CardImg = styled.img`
  border-radius: 30px;
  width: 100%;
  height: auto;
`

const generateImages = (onLastLoad: () => void) => {
  const arr = []
  let i = 0
  while (i <= 65) {
    arr.push(
      <CardImgWrapper key={i}>
        <CardImg src={`/images/doll/${i}.png`} onLoad={i === 65 ? onLastLoad : undefined} alt={''} />
        <RowFixed>
          <span>#{i + 1}&nbsp;</span>
          <span>/66</span>
        </RowFixed>
      </CardImgWrapper>
    )
    i++
  }

  return arr
}

export default function Box() {
  const [attemptingTxn] = useState(false)
  const [hash] = useState('')
  const [imgLoaded, setImgLoaded] = useState(false)

  const handleLoad = useCallback(() => {
    setImgLoaded(true)
  }, [])
  const images = useMemo(() => generateImages(handleLoad), [handleLoad])

  return (
    <Wrapper>
      <TYPE.monument style={{ width: '100%' }} textAlign="center">
        Art meets Finance
      </TYPE.monument>
      <FormWrapper>
        <HideMedium>
          <AnimationWrapper>
            <BoxBottom />
            <AnimatedLight />
            <AnimatedSlab src={BoxSlabUrl} alt="" />
          </AnimationWrapper>
        </HideMedium>
        <AppBody>
          {!attemptingTxn && !hash && <DefaultBox />}
          {attemptingTxn && !hash && (
            <LoadingView>
              <AutoColumn>
                <TYPE.black fontWeight={700} fontSize={30} className="title">
                  Approve for spending limitAntimatter NFT
                </TYPE.black>
              </AutoColumn>
            </LoadingView>
          )}
        </AppBody>
      </FormWrapper>
      <CardWrapper>
        <SwitchTabWrapper isWhite>
          <Tab key={'live'} onClick={() => {}} selected={true} isWhite>
            Live Box
          </Tab>
        </SwitchTabWrapper>
        {!imgLoaded && (
          <AnimatedWrapper style={{ marginTop: 100 }}>
            <AnimatedImg>
              <img src={Loader} alt="loading-icon" />
            </AnimatedImg>
          </AnimatedWrapper>
        )}
        <CardGrid style={{ display: imgLoaded ? 'inherit' : 'none' }}>{images}</CardGrid>
      </CardWrapper>
    </Wrapper>
  )
}
