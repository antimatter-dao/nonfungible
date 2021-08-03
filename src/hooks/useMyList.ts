import { useEffect, useMemo, useState } from 'react'
import { useSingleContractMultipleData } from 'state/multicall/hooks'
import { UserInfo } from 'state/userInfo/actions'
import { positionListFetch, indexListFetch } from 'utils/option/httpFetch'
import { formatNFTCardDetail } from 'utils/option/nftUtils'
import { useAllTokens } from './Tokens'
import { useIndexNFTContract } from './useContract'

interface MyListItem {
  creater: string
  description: string
  indexId: string
  indexName: string
  username: string
}

export function usePositionList(userInfo: UserInfo | undefined) {
  const [positionIdList, setPositionIdList] = useState<string[][]>([])
  const tokens = useAllTokens()

  useEffect(() => {
    ;(async () => {
      try {
        const positionList = await positionListFetch(userInfo?.token, userInfo?.account)
        const list = (positionList as any)?.list.map(({ indexId }: MyListItem) => [indexId])
        list && setPositionIdList(list)
      } catch (error) {
        console.error('fetch positionList', error)
      }
    })()
  }, [userInfo])

  const contract = useIndexNFTContract()
  const positionListRes = useSingleContractMultipleData(contract, 'getIndex', positionIdList)

  const res = useMemo(() => {
    return positionListRes.map(({ result }, idx) => formatNFTCardDetail(positionIdList[idx][0], result, tokens))
  }, [positionIdList, positionListRes, tokens])

  return res
}

export function useIndexList(userInfo: UserInfo | undefined) {
  const [indexList, setIndexList] = useState<MyListItem[]>([])
  useEffect(() => {
    ;(async () => {
      try {
        const indexList = await indexListFetch(userInfo?.token, userInfo?.account)
        const list: MyListItem[] | undefined = (indexList as any)?.list
        setIndexList(list ?? [])
      } catch (error) {
        console.error('fetch index List', error)
      }
    })()
  }, [userInfo])

  return indexList
}
