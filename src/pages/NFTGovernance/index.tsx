import React from 'react'
import styled from 'styled-components'
import { NFTGovernanceCard, CardColor, NFTGovernanceCardProps } from 'components/NFTCard'
import { ButtonText, TYPE } from 'theme'
import { ButtonOutlinedWhite, ButtonWhite } from 'components/Button'

const dummyData: NFTGovernanceCardProps[] = [
  {
    title: 'Transaction fees',
    color: CardColor.GREEN,
    time: '0d : 32h : 12m : 10s',
    address: '0xKos369cd6vwd94wq1gt4hr87ujv',
    synopsis:
      'The proposal is to use Dutch Auction format instead of the current Sealed Bid Auctions for all future Governance Vault sales. This will improve public...',
    voteFor: 213002,
    voteAgainst: 113402
  }
]

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: auto;
`

const ContentWrapper = styled.div`
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
const ActionBar = styled.div`
width: 100%;
height: ${({ theme }) => theme.headerHeight}
position: relative;
border-bottom: 1px solid ${({ theme }) => theme.text5};
display: flex;
justify-content: space-between;
padding: 0 124px;
${({ theme }) => theme.mediaWidth.upToLarge`padding: 0 30px`}
${({ theme }) => theme.mediaWidth.upToSmall`padding: 0 10px`}
`

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  & button {
    width: 156px;
    &:first-child {
      margin-right: 12px;
    }
  }
`

export default function NFTGovernance() {
  return (
    <Wrapper>
      <ActionBar>
        <div style={{ width: 127 }} />
        <ButtonGroup>
          <ButtonWhite>Voting</ButtonWhite>
          <ButtonOutlinedWhite>Governance Vault</ButtonOutlinedWhite>
        </ButtonGroup>
        <ButtonText style={{ width: 127 }}>
          <TYPE.link fontWeight={400}>+ Create Proposal</TYPE.link>
        </ButtonText>
      </ActionBar>
      <ContentWrapper>
        {dummyData.map(({ color, title, address, time, synopsis, voteFor, voteAgainst }, idx) => (
          <NFTGovernanceCard
            color={color}
            title={title}
            time={time}
            address={address}
            synopsis={synopsis}
            key={address + idx}
            voteFor={voteFor}
            voteAgainst={voteAgainst}
          />
        ))}
      </ContentWrapper>
    </Wrapper>
  )
}
