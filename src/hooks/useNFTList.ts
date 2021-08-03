import { AssetsParameter } from '../components/Creation'
import { useEffect, useState, useMemo } from 'react'
import { WrappedTokenInfo } from '../state/lists/hooks'
import { useSingleContractMultipleData } from '../state/multicall/hooks'
import { allNFTFetch } from '../utils/option/httpFetch'
import { useAllTokens } from './Tokens'
import { useIndexNFTContract } from './useContract'
import { toNumber } from './useIndexDetail'
import { ZERO_ADDRESS } from '../constants'

interface RecordListProps {
  creatorName: string
  id: string
}

export default function useNFTList() {
  const [nftIdList, setNftIdList] = useState<string[][]>([])
  const [recordList, setRecordList] = useState<RecordListProps[]>()
  const tokens = useAllTokens()

  useEffect(() => {
    ;(async () => {
      try {
        const positionList = await allNFTFetch()
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
  }, [])

  const contract = useIndexNFTContract()
  const nftRes = useSingleContractMultipleData(contract, 'getIndex', nftIdList)

  return useMemo(() => {
    return nftRes
      .map((res, idx) => {
        if (!res.result) {
          return undefined
        }
        const nft = res.result[0]
        if (nft.creator === ZERO_ADDRESS) return undefined
        const metadata = JSON.parse(nft.metadata)
        const assetsParameters: AssetsParameter[] = nft.underlyingAmounts.map(
          (val: any, index: number): AssetsParameter => {
            let _currencyToken = undefined
            if (tokens) {
              _currencyToken = tokens[val.currency] as WrappedTokenInfo
              if (!_currencyToken) _currencyToken = tokens[Object.keys(tokens)[0]] as WrappedTokenInfo
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
          indexId: recordList ? recordList[idx].id : '',
          creatorName: recordList ? recordList[idx].creatorName : '',
          assetsParameters
        }
      })
      .filter(v => v)
  }, [nftRes, tokens, recordList])
}
