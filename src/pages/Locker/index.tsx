import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import { CardColor } from 'components/NFTCard'
import { TYPE } from 'theme'
import { RowBetween } from 'components/Row'
import { ButtonOutlinedBlack, ButtonPrimary } from 'components/Button'
import Table from 'components/Table'
import { ReactComponent as Created } from 'assets/svg/created.svg'
import { ReactComponent as Transfer } from 'assets/svg/transfer.svg'
import { ReactComponent as Unlock } from 'assets/svg/unlock.svg'

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: auto;
  padding: 80px 124px;
`

const CardWrapper = styled.div`
  display: grid;
  grid-gap: 26px;
  grid-template-columns: auto auto auto;
  grid-template-row: 1;
`

const StyledCard = styled.div<{ color: CardColor }>`
  width: 380px;
  height: 140px;
  background: #ffffff;
  border-radius: 40px;
  position: relative;
  overflow: hidden;
  padding: 30px 52px;
  :before {
    position: absolute;
    content: '';
    z-index: 0;
    height: 117px;
    width: 420px;
    top: 0;
    border-radius: 120px;
    background: ${({ theme, color }) => theme[color]};
    filter: blur(100px);
    border-radius: 120px;
    opacity: 0.9;
    transform: translateY(-70%);
  }
`

const OpenButton = styled(ButtonOutlinedBlack)`
  width: 100px;
  padding: 12px;
`
const Profile = styled.div`
  display: flex;
  align-items: center;
`
const ProfileImg = styled.div<{ url?: string }>`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
  background: #000000 ${({ url }) => (url ? `url(${url})` : '')};
`

export default function Locker() {
  return (
    <Wrapper>
      <AutoColumn gap="72px">
        <CardWrapper>
          <Card
            color={CardColor.BLUE}
            title="Total value Locked"
            value={
              <>
                12345&nbsp;<span style={{ fontSize: 18 }}>$</span>
              </>
            }
          />
          <Card color={CardColor.RED} title="Number of lockers created" value={<>123</>} />
          <Card
            color={CardColor.GREEN}
            title="Number of owners"
            value={
              <>
                123&nbsp;<span style={{ fontSize: 18 }}>Addresses</span>
              </>
            }
          />
        </CardWrapper>
        <AutoColumn gap="24px">
          <RowBetween>
            <TYPE.body fontWeight={500} fontSize={30}>
              Activity
            </TYPE.body>
            <ButtonPrimary width="160px">My Locker</ButtonPrimary>
          </RowBetween>
          <Table
            header={['Event', 'Token type', 'Date', 'Owner', '']}
            rows={[
              [
                <>
                  <Created />
                  Created
                </>,
                'erc-721',
                '00:00 02.13.2021',
                <OwnerCell name="Jack" key="1" />
              ],
              [
                <>
                  <Unlock />
                  Unlock
                </>,
                'erc-721',
                '00:00 02.13.2021',
                <OwnerCell name="Jack" key="1" />,
                <OpenButton key="1">Open</OpenButton>
              ],
              [
                <>
                  <Transfer />
                  Transfer
                </>,
                'erc-721',
                '00:00 02.13.2021',
                <OwnerCell name="Jack" key="1" />,
                <OpenButton key="2">Open</OpenButton>
              ]
            ]}
          />
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  )
}

function Card({ color, value, title }: { color: CardColor; value: JSX.Element; title: string }) {
  return (
    <StyledCard color={color}>
      <AutoColumn gap="12px">
        <TYPE.black fontSize={40} fontWeight={700}>
          {value}
        </TYPE.black>
        <TYPE.darkGray fontSize={20} fontWeight={500}>
          {title}
        </TYPE.darkGray>
      </AutoColumn>
    </StyledCard>
  )
}

function OwnerCell({ url, name }: { url?: string; name: string }) {
  return (
    <Profile>
      <ProfileImg url={url} />
      {name}
    </Profile>
  )
}
