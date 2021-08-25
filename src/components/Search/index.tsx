import React, { useState, useCallback, useEffect } from 'react'
// import { X } from 'react-feather'
import styled from 'styled-components'
import { RowFixed } from 'components/Row'
import NFTButtonSelect from 'components/Button/NFTButtonSelect'
import { ButtonEmpty, ButtonOutlinedPrimary, ButtonPrimary } from 'components/Button'
import { ReactComponent as SearchIcon } from '../../assets/svg/search.svg'
import { TextValueInput } from 'components/TextInput'
import { CloseIcon, MEDIA_WIDTHS, TYPE } from 'theme'
import useMediaWidth from 'hooks/useMediaWidth'

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
    id: 'createName',
    option: 'Creator name'
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
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 0;
  padding-top: 44px;
  grid-gap: 24px
`}
`

const ButtonWrapper = styled(RowFixed)`
  margin-left: 32px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-left: 0;
  margin-top: 35px;
  flex-direction: column
  width: 100%;
  button{
    width: 100%;
    :first-child{
      margin-bottom: 16px
    }
  }
`};
`

const MobileSearchWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  padding: ${({ theme }) => theme.mobileHeaderHeight} 24px 24px
  width: 100%;
  background-color: ${({ theme }) => theme.bg1};
  z-index: 12;
  height: 100vh;
`

const MobileSearchButton = styled(ButtonEmpty)`
  position: fixed;
  top: 21px;
  z-index: 11;
  right: 72px;
  width: fit-content;
  height: auto;
  svg {
    z-index: 11;
  }
`

const MobileCloseIcon = styled(CloseIcon)`
  position: absolute;
  top: 32px;
  right: 25px;
  > * {
    stroke: #ffffff;
  }
`

export default function Search({ onSearch }: { onSearch: (searchParam: string, searchBy: string) => void }) {
  const [searchParam, setSearchParam] = useState('')
  const [searchBy, setSearchBy] = useState('')
  const match = useMediaWidth('upToLarge')

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
            width={match ? '100%' : '280px'}
            options={SearchParams}
            selectedId={searchParam}
            placeholder="Select search parameter"
            marginRight={match ? '0' : '10px'}
          />
          <TextValueInput
            borderColor="#ffffff"
            value={searchBy}
            onUserInput={val => {
              setSearchBy(val)
            }}
            placeholder="Search by"
            height="3rem"
            maxWidth={match ? 'unset' : '552px'}
          />
          <ButtonWrapper>
            <ButtonPrimary width="152px" onClick={handleSearch}>
              <SearchIcon style={{ marginRight: 10, fill: '#000000' }} />
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

export function MobileSearch({ onSearch }: { onSearch: (searchParam: string, searchBy: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const match = useMediaWidth('upToSmall' as keyof typeof MEDIA_WIDTHS)

  useEffect(() => {
    if (!match) {
      setIsOpen(false)
    }
  }, [match])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <>
      <MobileSearchButton onClick={handleOpen} id="mobileSearch">
        <SearchIcon style={{ fill: '#ffffff' }} />
      </MobileSearchButton>
      {isOpen && (
        <MobileSearchWrapper>
          <MobileCloseIcon onClick={handleClose} />
          {/* <ButtonEmpty onClick={handleClose}>
            <X size={24} />
          </ButtonEmpty> */}
          <TYPE.body fontSize={28} fontWeight={500}>
            Search a sport index
          </TYPE.body>
          <Search onSearch={onSearch} />
        </MobileSearchWrapper>
      )}
    </>
  )
}
