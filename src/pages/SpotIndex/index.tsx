import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import NFTCard, { CardColor, NFTCardProps } from 'components/NFTCard'
import Search, { MobileSearch } from 'components/Search'
import useNFTList from 'hooks/useNFTList'
import CurrencyLogo from 'components/CurrencyLogo'
import Pagination from 'components/Pagination'
import { AnimatedImg, AnimatedWrapper, HideSmall, TYPE, ShowSmall } from 'theme'
import Loader from 'assets/svg/antimatter_icon.svg'
import { SportIndexSearchProps } from 'utils/option/httpFetch'
import { useToken } from 'hooks/Tokens'

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
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin:24px
  `}
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
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 24px;
    grid-template-columns: repeat(auto-fill, 312px);
   `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-template-columns: 100%;
  `}
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

function ShowCurrencyLogo({ address }: { address: string }) {
  const currency = useToken(address)
  return <CurrencyLogo currency={currency ?? undefined} key={address} />
}

export default function SpotIndex() {
  const history = useHistory()
  const [showLoading, setShowLoading] = useState(true)
  const [lastChangeLoading, setLastChangeLoading] = useState(new Date().getTime())

  const [searchParam, setSearchParam] = useState<SportIndexSearchProps>({
    searchParam: '',
    searchBy: ''
  })
  const {
    page: { countPages, currentPage, setCurrentPage },
    loading,
    data: NFTListData
  } = useNFTList(searchParam)
  useEffect(() => {
    const _time = new Date().getTime()
    if (NFTListData.length && !loading && _time - lastChangeLoading > 100) {
      setShowLoading(false)
      setLastChangeLoading(_time)
    }
  }, [NFTListData, lastChangeLoading, loading])

  const NFTListCardData = useMemo((): NFTCardProps[] => {
    return NFTListData.map(NFTIndexInfo => {
      if (!NFTIndexInfo) return defaultCardData
      const _icons = NFTIndexInfo.assetsParameters.map((val, idx) => {
        return val.currencyToken ? (
          <CurrencyLogo currency={val.currencyToken} key={idx} />
        ) : (
          <ShowCurrencyLogo address={val.currency} />
        )
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
      setShowLoading(true)
      setLastChangeLoading(new Date().getTime())
      setSearchParam({
        searchParam,
        searchBy
      })
      setCurrentPage(1)
    },
    [setCurrentPage, setSearchParam]
  )

  return (
    <>
      <ShowSmall>
        <MobileSearch onSearch={handleSearch} />
      </ShowSmall>
      <Wrapper>
        <HideSmall>
          <Search onSearch={handleSearch} />
        </HideSmall>
        {showLoading && loading ? (
          <AnimatedWrapper style={{ marginTop: 100, opacity: 0.8 }}>
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
            <Pagination
              page={currentPage}
              count={countPages}
              setPage={page => {
                setShowLoading(true)
                setLastChangeLoading(new Date().getTime())
                setCurrentPage(page)
              }}
            />
          </>
        )}
      </Wrapper>
    </>
  )
}
