import React, { useState, useCallback, useMemo } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import NFTCard, { CardColor, NFTCardProps } from 'components/NFTCard'
import { RowFixed } from 'components/Row'
import NFTButtonSelect from 'components/Button/NFTButtonSelect'
import { ButtonOutlinedPrimary, ButtonPrimary } from 'components/Button'
import { ReactComponent as SearchIcon } from '../../assets/svg/search.svg'
import { TextValueInput } from 'components/TextInput'
import useNFTList from 'hooks/useNFTList'
import CurrencyLogo from 'components/CurrencyLogo'
import Pagination from 'components/Pagination'
import { AnimatedImg, AnimatedWrapper, TYPE } from 'theme'
import Loader from 'assets/svg/antimatter_background_logo.svg'
import { SportIndexSearchProps } from 'utils/option/httpFetch'

const SearchParams = [
  {
    id: 'indexName',
    option: 'Index Name'
  },
  {
    id: 'indexId',
    option: 'Index ID'
  }
  // {
  //   id: 'creatorName',
  //   option: 'Creator Name'
  // },
  // {
  //   id: 'creatorAddress',
  //   option: 'Creator Address'
  // }
]

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: auto;
`
const EmptyList = styled.div`
  transform: translateY(30px);
  border: 1px solid ${({ theme }) => theme.text4};
  color: ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  max-width: 760px;
  margin: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
    grid-gap:10px;
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

const defaultCardData = {
  id: '',
  name: '',
  indexId: '',
  color: CardColor.RED,
  address: '',
  icons: [],
  creator: ''
}

export default function SpotIndex() {
  const history = useHistory()
  const [searchParam, setSearchParam] = useState<SportIndexSearchProps>({
    searchParam: '',
    searchBy: ''
  })
  const {
    page: { countPages, currentPage, setCurrentPage },
    loading,
    data: NFTListData
  } = useNFTList(searchParam)

  const NFTListCardData = useMemo((): NFTCardProps[] => {
    return NFTListData.map(NFTIndexInfo => {
      if (!NFTIndexInfo) return defaultCardData
      const _icons = NFTIndexInfo.assetsParameters.map((val, idx) => {
        return <CurrencyLogo currency={val.currencyToken} key={idx} />
      })
      return {
        id: NFTIndexInfo.indexId,
        name: NFTIndexInfo.name,
        indexId: NFTIndexInfo.indexId,
        color: NFTIndexInfo.color,
        address: NFTIndexInfo.creator,
        icons: _icons,
        creator: NFTIndexInfo.creatorName
      }
    })
  }, [NFTListData])

  const handleSearch = useCallback(
    (searchParam: string, searchBy: string) => {
      setSearchParam({
        searchParam,
        searchBy
      })
      setCurrentPage(1)
    },
    [setCurrentPage, setSearchParam]
  )

  return (
    <Wrapper>
      <Search onSearch={handleSearch} />
      {loading ? (
        <AnimatedWrapper style={{ marginTop: 40 }}>
          <AnimatedImg>
            <img src={Loader} alt="loading-icon" />
          </AnimatedImg>
        </AnimatedWrapper>
      ) : (
        <>
          {NFTListCardData?.length === 0 && (
            <EmptyList>
              <TYPE.body style={{ marginBottom: '8px' }}>No NFT found.</TYPE.body>
              <TYPE.subHeader>
                <i>You can create or change search criteria.</i>
              </TYPE.subHeader>
            </EmptyList>
          )}
          <ContentWrapper>
            {NFTListCardData.map(({ color, address, icons, indexId, creator, name, id }, idx) => (
              <NFTCard
                key={`${id}${idx}`}
                id={id}
                color={color}
                address={address}
                icons={icons}
                indexId={indexId}
                creator={creator}
                name={name}
                onClick={() => history.push(`/spot_detail/${indexId}`)}
              />
            ))}
          </ContentWrapper>
          <Pagination page={currentPage} count={countPages} setPage={setCurrentPage} />
        </>
      )}
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
    onSearch('', '')
  }, [onSearch])

  return (
    <>
      <WrapperSearch>
        <StyledSearch>
          <NFTButtonSelect
            onSelection={id => {
              setSearchParam(id)
            }}
            width="280px"
            options={SearchParams}
            selectedId={searchParam}
            placeholder="Select search parameter"
            marginRight="10px"
          />
          <TextValueInput
            borderColor="#ffffff"
            value={searchBy}
            onUserInput={val => {
              setSearchBy(val)
            }}
            placeholder="Search by"
            maxWidth="552px"
            height="3rem"
          />
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
