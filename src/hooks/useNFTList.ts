import { AssetsParameter } from '../components/Creation'
import { useEffect, useState, useMemo } from 'react'
import { WrappedTokenInfo } from '../state/lists/hooks'
import { useSingleContractMultipleData } from '../state/multicall/hooks'
import { allNFTFetch, SportIndexSearchProps } from '../utils/option/httpFetch'
import { useAllTokens } from './Tokens'
import { useIndexNFTContract } from './useContract'
import { toNumber } from './useIndexDetail'
import { ZERO_ADDRESS } from '../constants'
import { CardColor } from 'components/NFTCard'
import { useBlockNumber } from 'state/application/hooks'

interface RecordListProps {
  creatorName: string
  id: string
}

interface NFTSpotListProps {
  name: string
  description: string
  color: CardColor
  creator: string
  indexId: string
  creatorName: string
  assetsParameters: AssetsParameter[]
}

export default function useNFTList(
  searchParams: SportIndexSearchProps
): {
  loading: boolean
  page: {
    countPages: number
    currentPage: number
    setCurrentPage: (page: number) => void
  }
  data: NFTSpotListProps[]
} {
  const [nftIdList, setNftIdList] = useState<string[][]>([])
  const [recordList, setRecordList] = useState<RecordListProps[]>()
  const [reqLoading, setReqLoading] = useState<boolean>(false)
  const [countPages, setCountPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [successNFTRes, setSuccessNFTRes] = useState<any[]>([])
  const blockNumber = useBlockNumber()
  const tokens = useAllTokens()

  useEffect(() => {
    ;(async () => {
      try {
        setReqLoading(true)
        const positionList = await allNFTFetch(currentPage, searchParams)
        setReqLoading(false)
        setCountPages(positionList.pages ?? 0)
        const idList: string[][] | undefined = positionList?.list?.map(({ indexId }: { indexId: string }) => [indexId])
        const _recordList: RecordListProps[] = positionList?.list?.map(
          (item: { indexId: string; username: string }) => {
            return {
              creatorName: item.username ?? '',
              id: item.indexId
            }
          }
        )
        idList && setNftIdList(idList)
        _recordList && setRecordList(_recordList)
      } catch (error) {
        console.error('fetch NFT List', error)
      }
    })()
  }, [currentPage, searchParams, blockNumber])

  const contract = useIndexNFTContract()
  const nftRes = useSingleContractMultipleData(contract, 'getIndex', nftIdList)

  useEffect(() => {
    console.log('exec')
    if (nftRes.length && nftRes[0].loading !== true && nftRes[0].error !== true && nftRes[0].result) {
      setSuccessNFTRes([...nftRes])
    }
  }, [nftRes])

  return useMemo(() => {
    const data = successNFTRes
      .map((res, idx) => {
        if (!res.result) {
          return undefined
        }
        const nft = res.result[0]
        if (nft.creator === ZERO_ADDRESS) return undefined
        const metadata = JSON.parse(nft.metadata)
        const assetsParameters: AssetsParameter[] = nft.underlyingAmounts.map(
          (val: string, index: number): AssetsParameter => {
            let _currencyToken = undefined
            if (tokens) {
              _currencyToken = tokens[nft.underlyingTokens[index]] as WrappedTokenInfo
              // if (!_currencyToken) _currencyToken = tokens[Object.keys(tokens)[0]] as WrappedTokenInfo
            }

            return {
              amount: toNumber(val.toString(), _currencyToken),
              currency: nft.underlyingTokens[index],
              currencyToken: _currencyToken
            }
          }
        )
        return {
          name: nft.name,
          description: metadata.description,
          color: metadata.color,
          creator: nft.creator,
          indexId: recordList ? recordList[idx]?.id : '',
          creatorName: recordList ? recordList[idx]?.creatorName : '',
          assetsParameters
        }
      })
      .filter(v => !!v)

    return {
      loading: !!(reqLoading || (nftRes.length && nftRes[0].loading)),
      data: data as NFTSpotListProps[],
      page: {
        countPages,
        currentPage,
        setCurrentPage: setCurrentPage
      }
    }
  }, [nftRes, successNFTRes, reqLoading, countPages, currentPage, recordList, tokens])
}
