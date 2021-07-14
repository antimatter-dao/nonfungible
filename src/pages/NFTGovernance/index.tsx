import React from 'react'
import styled from 'styled-components'
import { NFTGovernanceCard, CardColor } from 'components/NFTCard'

const dummyData = [
  {
    title: 'Transaction fees',
    color: CardColor.GREEN,
    time: '0d : 32h : 12m : 10s',
    address: '0xKos369cd6vwd94wq1gt4hr87ujv'
  }
]

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: auto;
`

export const ContentWrapper = styled.div`
  position: relative;
  max-width: 1280px;
  margin: auto;
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(auto-fill, 280px);
  padding: 52px 0;
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToLarge`padding: 30px`}
  ${({ theme }) => theme.mediaWidth.upToSmall`padding: 10px`}
`

export default function NFTGovernance() {
  return (
    <Wrapper>
      <ContentWrapper>
        {dummyData.map(({ color, title, address, time }) => (
          <NFTGovernanceCard color={color} title={title} time={time} address={address} />
        ))}
      </ContentWrapper>
    </Wrapper>
  )
}
