import React from 'react'
import styled from 'styled-components'
import { ExternalLink, TYPE } from 'theme'
import { RowBetween, RowFixed } from 'components/Row'
import gradient from 'assets/svg/overlay_green.svg'

const StyledCard = styled.div`
  width: 280px;
  height: auto;
  position: relative;
  overflow: hidden;
  min-height: 320px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #ffffff url(${gradient}) -50% 0 no-repeat;
  padding: 20px;
  border-radius: 30px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  width: 100%;
`}
`

export default function NFTArtCard({ imgSrc }: { imgSrc: string }) {
  return (
    <StyledCard>
      <img src={imgSrc}></img>
      <RowBetween>
        <RowFixed>
          <TYPE.black fontSize={20} fontWeight={400}>
            #5
          </TYPE.black>
          <TYPE.darkGray fontSize={14}>/66</TYPE.darkGray>
        </RowFixed>
        <ExternalLink href="" style={{ color: '#cccccc' }}>
          Open in OpenSea
        </ExternalLink>
      </RowBetween>
    </StyledCard>
  )
}
