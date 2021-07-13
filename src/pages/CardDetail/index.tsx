import { ButtonEmpty, ButtonWhite } from 'components/Button'
import { RowBetween, RowFixed } from 'components/Row'
import { StyledTabItem, StyledTabs } from 'components/Tabs'
import React from 'react'
import { ChevronLeft } from 'react-feather'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Hr, Paragraph } from './Paragraph'

const Wrapper = styled.div`
  min-height: calc(100vh - ${({ theme }) => theme.headerHeight});
  width: 1182px;
  margin: auto;
`
const TabButton = styled(ButtonWhite)<{ current?: string | boolean }>`
  width: 152px;
  color: ${({ theme, current }) => (current ? theme.black : theme.white)};
  background-color: ${({ theme, current }) => (current ? theme.white : 'transparent')};
  border-color: ${({ theme }) => `1px solid ${theme.white}`};
`
const InfoPanel = styled.div`
  background: #ffffff;
  border-radius: 40px;
  width: 69%;
  padding: 26px 52px;
  min-height: 490px;
`

const StyledAvatar = styled.div`
  width: 36px;
  height: 36px;
  margin-right: 12px;
  > img {
    background-color: #eee;
    width: 100%;
    height: 100%;
  }
`

export default function CardDetail() {
  const theme = useTheme()

  return (
    <>
      <RowBetween style={{ padding: '27px 20px' }}>
        <ButtonEmpty width="auto" color={theme.text1}>
          <ChevronLeft />
          Go Back
        </ButtonEmpty>
        <RowBetween style={{ width: 320 }}>
          <TabButton current>Information</TabButton>
          <TabButton>Trade</TabButton>
        </RowBetween>
        <div style={{ width: 110 }} />
      </RowBetween>
      <Wrapper>
        <RowBetween style={{ marginTop: 70 }} align="flex-start">
          <InfoPanel
            style={{
              width: '30%'
            }}
          />
          <InfoPanel>
            <StyledTabs>
              <StyledTabItem>Creator info</StyledTabItem>
              <StyledTabItem current>Index info</StyledTabItem>
              <StyledTabItem>Underlying asset</StyledTabItem>
            </StyledTabs>
            <div>
              <RowFixed>
                <StyledAvatar>
                  <img src="" alt="" />
                </StyledAvatar>
                <Paragraph header="Creator wallet Address">0xKos369cd6vwd94wq1gt4hr87ujv</Paragraph>
              </RowFixed>
              <Hr />
              <Paragraph header="Creator wallet Address">0xKos369cd6vwd94wq1gt4hr87ujv</Paragraph>
              <Hr />
              <Paragraph header="Creator ID">#1234</Paragraph>
              <Hr />
              <Paragraph header="Bio">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam. Quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
              </Paragraph>
            </div>
          </InfoPanel>
        </RowBetween>
      </Wrapper>
    </>
  )
}
