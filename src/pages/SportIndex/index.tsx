import React, { useState, useCallback } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import NFTCard, { CardColor, NFTCardProps } from 'components/NFTCard'
import { ReactComponent as ETH } from 'assets/svg/eth_logo.svg'
import { RowFixed } from 'components/Row'
import NFTButtonSelect from 'components/Button/NFTButtonSelect'
import { ButtonOutlinedPrimary, ButtonPrimary } from 'components/Button'
import { ReactComponent as SearchIcon } from '../../assets/svg/search.svg'
import TextInput from 'components/TextInput'

export const dummyData: NFTCardProps[] = [
  {
    id: 1,
    name: 'Index Name',
    indexId: '1',
    color: CardColor.RED,
    address: '0xKos369cd6vwd94wq1gt4hr87ujv',
    icons: [<ETH key="1" />],
    creator: 'Jack'
  },
  {
    id: 2,
    name: 'Index Name',
    indexId: '2',
    color: CardColor.RED,
    address: '0xKos369cd6vwd94wq1gt4hr87ujv',
    icons: [<ETH key="1" />, <ETH key="2" />],
    creator: 'Jack'
  },
  {
    id: 3,
    name: 'Index Name',
    indexId: '3',
    color: CardColor.BLUE,
    address: '0xKos369cd6vwd94wq1gt4hr87ujv',
    icons: [<ETH key="1" />, <ETH key="2" />, <ETH key="3" />],
    creator: 'Jack'
  },
  {
    id: 4,
    name: 'Index Name',
    indexId: '4',
    color: CardColor.YELLOW,
    address: '0xKos369cd6vwd94wq1gt4hr87ujv',
    icons: [<ETH key="1" />, <ETH key="2" />, <ETH key="3" />, <ETH key="4" />],
    creator: 'Jack'
  },
  {
    id: 5,
    name: 'Index Name',
    indexId: '5',
    color: CardColor.GREEN,
    address: '0xKos369cd6vwd94wq1gt4hr87ujv',
    icons: [<ETH key="1" />, <ETH key="2" />, <ETH key="3" />, <ETH key="4" />, <ETH key="5" />],
    creator: 'Jack'
  },
  {
    id: 6,
    name: 'Index Name',
    indexId: '6',
    color: CardColor.PURPLE,
    address: '0xKos369cd6vwd94wq1gt4hr87ujv',
    icons: [<ETH key="1" />, <ETH key="2" />, <ETH key="3" />, <ETH key="4" />, <ETH key="5" />, <ETH key="6" />],
    creator: 'Jack'
  },
  {
    id: 7,
    name: 'Index Name',
    indexId: '7',
    color: CardColor.PURPLE,
    address: '0xKos369cd6vwd94wq1gt4hr87ujv',
    icons: [
      <ETH key="1" />,
      <ETH key="2" />,
      <ETH key="3" />,
      <ETH key="4" />,
      <ETH key="5" />,
      <ETH key="6" />,
      <ETH key="7" />
    ],
    creator: 'Jack'
  },
  {
    id: 8,
    name: 'Index Name',
    indexId: '8',
    color: CardColor.PURPLE,
    address: '0xKos369cd6vwd94wq1gt4hr87ujv',
    icons: [
      <ETH key="1" />,
      <ETH key="2" />,
      <ETH key="3" />,
      <ETH key="4" />,
      <ETH key="5" />,
      <ETH key="6" />,
      <ETH key="7" />,
      <ETH key="8" />
    ],
    creator: 'Jack'
  }
]

const SearchParams = [
  {
    id: 'indexName',
    option: 'Index Name'
  },
  {
    id: 'indexId',
    option: 'Index ID'
  },
  {
    id: 'creatorName',
    option: 'Creator Name'
  },
  {
    id: 'creatorAddress',
    option: 'Creator Address'
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

const WrapperSearch = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.text5};
`

const StyledSearch = styled.div`
  margin: auto;
  padding: 23px 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  width: 1280px;
  & > div {
    flex-shrink: 1;
  }
  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 23px 50px;
    flex-wrap: wrap
    flex-direction: column
    width: 100%;
  `}
`
const ButtonWrapper = styled(RowFixed)`
  margin-left: 32px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-left: 0;
  flex-direction: column
  width: 100%;
  button{
    width: 100%;
    :first-child{
      margin-bottom: 8px
    }
  }
`};
`

export default function SportIndex() {
  const history = useHistory()
  const handleSearch = useCallback((searchParam: string, searchBy: string) => {
    console.log(searchParam, searchBy)
  }, [])
  return (
    <Wrapper>
      <Search onSearch={handleSearch} />
      <ContentWrapper>
        {dummyData.map(({ color, address, icons, indexId, creator, name, id }) => (
          <NFTCard
            id={id}
            color={color}
            address={address}
            icons={icons}
            indexId={indexId}
            key={indexId}
            creator={creator}
            name={name}
            onClick={() => history.push('/card_detail')}
          />
        ))}
      </ContentWrapper>
    </Wrapper>
  )
}

export function Search({ onSearch }: { onSearch: (searchParam: string, searchBy: string) => void }) {
  const [searchParam, setSearchParam] = useState('')
  const [searchBy, setSearchBy] = useState('')

  const handleSearch = useCallback(() => {
    onSearch(searchParam, searchBy)
  }, [onSearch, searchBy, searchParam])

  const handleClear = useCallback(() => {
    setSearchParam('')
    setSearchBy('')
  }, [])

  const handleSearchParam = useCallback((id: string) => {
    setSearchParam(id)
  }, [])
  return (
    <>
      <WrapperSearch>
        <StyledSearch>
          <NFTButtonSelect
            onSelection={handleSearchParam}
            width="280px"
            options={SearchParams}
            selectedId={searchParam}
            placeholder="Select search parameter"
            marginRight="10px"
          />
          <TextInput placeholder="Search by" maxWidth="552px" height="3rem" />
          <ButtonWrapper>
            <ButtonPrimary width="152px" onClick={handleSearch}>
              <SearchIcon style={{ marginRight: 10 }} />
              Search
            </ButtonPrimary>
            <div style={{ width: 10 }} />
            <ButtonOutlinedPrimary width="152px" onClick={handleClear}>
              Show All
            </ButtonOutlinedPrimary>
          </ButtonWrapper>
        </StyledSearch>
      </WrapperSearch>
    </>
  )
}
