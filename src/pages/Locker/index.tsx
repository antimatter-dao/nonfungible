import React, { useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import { CardColor } from 'components/NFTCard'
import { TYPE } from 'theme'
import { RowBetween } from 'components/Row'
import { ButtonOutlinedBlack, ButtonPrimary } from 'components/Button'
import Table, { OwnerCell } from 'components/Table'
import { ReactComponent as Created } from 'assets/svg/created.svg'
import { ReactComponent as Claim } from 'assets/svg/claim.svg'
import { ReactComponent as Transfer } from 'assets/svg/transfer.svg'
// import { ReactComponent as Unlock } from 'assets/svg/unlock.svg'
import { useHistory } from 'react-router-dom'
import { useLogin, useCurrentUserInfo } from 'state/userInfo/hooks'
import { LockerIndexEventType, useLockerIndexData } from '../../hooks/useLockerIndex'
import Pagination from 'components/Pagination'

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: auto;
  padding: 80px 124px;
  ${({ theme }) => theme.mediaWidth.upToLarge`
  padding: 40px;
  `}
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 24px;
  `}
`

const CardWrapper = styled.div`
  display: grid;
  grid-gap: 26px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  grid-template-columns: 100%;
  grid-template-rows: 1fr,1fr,1fr;
  `}
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
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `}
`

const OpenButton = styled(ButtonOutlinedBlack)`
  width: 100px;
  padding: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `}
`

export default function Locker() {
  const userInfo = useCurrentUserInfo()
  const { login } = useLogin()
  const history = useHistory()
  const {
    data,
    page: { currentPage, totalPages, setCurrentPage }
  } = useLockerIndexData()

  const handleLockerClick = useCallback(() => {
    if (userInfo && userInfo.token) {
      history.push('/profile/my_locker')
      return
    } else login()
  }, [userInfo, login, history])

  const tableData = useMemo(() => {
    return data.list
      .filter(i => i.eventType !== LockerIndexEventType.Claim)
      .map(item => {
        return [
          item.eventType === LockerIndexEventType.Created ? (
            <>
              <Created style={{ marginRight: 10 }} />
              Created
            </>
          ) : item.eventType === LockerIndexEventType.Transfer ? (
            <>
              <Transfer style={{ marginRight: 10 }} />
              Transfer
            </>
          ) : (
            <>
              <Claim style={{ marginRight: 10 }} />
              Claim
            </>
          ),
          item.tokenType,
          new Date(Number(item.timestamp) * 1000).toLocaleString('en-US'),
          <OwnerCell name={item.username} key="1" />,
          item.status === 0 ? (
            <OpenButton
              key="2"
              onClick={() => {
                history.push(`/locker/${item.indexId}`)
              }}
            >
              Open
            </OpenButton>
          ) : (
            <></>
          )
        ]
      })
  }, [data.list, history])

  return (
    <Wrapper>
      <AutoColumn gap="72px">
        <CardWrapper>
          {/* <Card
            color={CardColor.BLUE}
            title="Total value Locked"
            value={
              <>
                -&nbsp;<span style={{ fontSize: 18 }}>$</span>
              </>
            }
          /> */}
          <Card color={CardColor.RED} title="Number of lockers created" value={<>{data.lockerCreatedCount}</>} />
          <Card
            color={CardColor.GREEN}
            title="Number of owners"
            value={
              <>
                {data.ownerCount}&nbsp;<span style={{ fontSize: 18 }}>Addresses</span>
              </>
            }
          />
        </CardWrapper>
        <AutoColumn gap="24px">
          <RowBetween>
            <TYPE.body fontWeight={500} fontSize={30}>
              Activity
            </TYPE.body>
            {userInfo && userInfo.token && (
              <ButtonPrimary width="160px" onClick={handleLockerClick}>
                My Locker
              </ButtonPrimary>
            )}
          </RowBetween>
          <Table header={['Event', 'Token type', 'Date', 'Owner', '']} rows={tableData} />
          <Pagination
            page={currentPage}
            count={totalPages}
            setPage={page => {
              setCurrentPage(page)
            }}
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
