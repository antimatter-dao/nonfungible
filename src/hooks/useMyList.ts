import { useWeb3React } from '@web3-react/core'
import { NFTCardProps } from 'components/NFTCard'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useSingleContractMultipleData } from 'state/multicall/hooks'
import { saveUserInfo, UserInfo } from 'state/userInfo/actions'
import {
  positionListFetch,
  indexListFetch,
  userInfoFetch,
  UserInfoQuery,
  myLockerListFetch
} from 'utils/option/httpFetch'
import { formatNFTCardDetail } from 'utils/option/nftUtils'
import { useAllTokens } from './Tokens'
import { useIndexNFTContract, useLocker721NFTContract } from './useContract'

interface MyListItem {
  creater: string
  description: string
  indexId: string
  indexName: string
  username: string
}

export function usePositionList(
  userInfo: UserInfo | undefined
): {
  loading: boolean
  page: {
    totalPages: number
    currentPage: number
    setCurrentPage: (page: number) => void
  }
  data: NFTCardProps[]
} {
  const [positionDataList, setPositionDataList] = useState<any[]>([])
  const [positionIdList, setPositionIdList] = useState<string[][]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)

  const tokens = useAllTokens()

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const positionList = await positionListFetch(userInfo?.token, userInfo?.account, currentPage, 10)
        setIsLoading(false)
        const IdList = (positionList as any)?.list.map(({ indexId }: MyListItem) => [indexId])
        IdList && setPositionIdList(IdList)
        positionList && setPositionDataList((positionList as any)?.list ?? [])
        positionList && setTotalPages((positionList as any)?.pages ?? 0)
      } catch (error) {
        console.error('fetch positionList', error)
      }
    })()
  }, [currentPage, userInfo])

  const contract = useIndexNFTContract()
  const positionListRes = useSingleContractMultipleData(contract, 'getIndex', positionIdList)

  const resList = useMemo(() => {
    return positionListRes.map(({ result }, idx) => {
      return {
        ...formatNFTCardDetail(positionIdList[idx][0], result ? result[0] : undefined, tokens),
        creator: positionDataList[idx]?.username ?? ''
      } as NFTCardProps
    })
  }, [positionDataList, positionIdList, positionListRes, tokens])

  const res = useMemo(
    () => ({ page: { totalPages, currentPage, setCurrentPage }, loading: isLoading, data: resList }),
    [currentPage, isLoading, resList, totalPages]
  )
  return res
}

export function useIndexList(
  userInfo: UserInfo | undefined
): {
  loading: boolean
  page: {
    totalPages: number
    currentPage: number
    setCurrentPage: (page: number) => void
  }
  data: any[]
} {
  const [indexList, setIndexList] = useState<MyListItem[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [totalPages, setTotalPages] = useState<number>(0)

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const indexList = await indexListFetch(userInfo?.token, userInfo?.account, currentPage, 8)
        setIsLoading(false)
        const list: MyListItem[] | undefined = (indexList as any)?.list
        setIndexList(list ?? [])
        indexList && setTotalPages((indexList as any)?.pages ?? 0)
      } catch (error) {
        console.error('fetch index List', error)
      }
    })()
  }, [currentPage, userInfo])

  const res = useMemo(
    () => ({
      loading: isLoading,
      data: indexList,
      page: { totalPages, currentPage, setCurrentPage }
    }),
    [currentPage, indexList, isLoading, totalPages]
  )

  return res
}

export function useUserInfoUpdate(userInfo: UserInfo | undefined) {
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const callback = useCallback(
    async (params: UserInfoQuery) => {
      const res: any = await userInfoFetch(userInfo?.token, params)
      if (res && userInfo && account) {
        dispatch(
          saveUserInfo({
            address: account,
            userInfo: {
              ...userInfo,
              username: res.username ?? '',
              bio: res.description ?? ''
            }
          })
        )
      }
    },
    [account, dispatch, userInfo]
  )

  return useMemo(() => {
    return { updateUserInfoCallback: callback }
  }, [callback])
}

export function useMyLockerList(
  userInfo: UserInfo | undefined
): {
  loading: boolean
  page: {
    totalPages: number
    currentPage: number
    setCurrentPage: (page: number) => void
  }
  data: NFTCardProps[]
} {
  const [myLockerDataList, setMyLockerDataList] = useState<any[]>([])
  const [myLockerIdList, setMyLockerIdList] = useState<string[][] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [firstLoading, setFirstLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)

  const tokens = useAllTokens()

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const _lockerList = await myLockerListFetch(userInfo?.token, userInfo?.account, currentPage, 10)
        setIsLoading(false)
        const IdList = (_lockerList as any)?.list.map((item: any) => [item.indexId ?? 0])
        IdList && setMyLockerIdList(IdList)
        _lockerList && setMyLockerDataList((_lockerList as any)?.list ?? [])
        _lockerList && setTotalPages((_lockerList as any)?.pages ?? 0)
      } catch (error) {
        console.error('fetch useMyLockerList', error)
      }
    })()
  }, [currentPage, userInfo])

  const contract = useLocker721NFTContract()
  const lockerListRes = useSingleContractMultipleData(contract, 'getPool', myLockerIdList ?? [])

  const resList = useMemo(() => {
    return lockerListRes.map(({ result }, idx) => {
      return {
        ...formatNFTCardDetail(myLockerIdList ? myLockerIdList[idx][0] : '', result ? result[0] : undefined, tokens),
        creator: myLockerDataList[idx]?.username ?? ''
      } as NFTCardProps
    })
  }, [myLockerDataList, myLockerIdList, lockerListRes, tokens])

  useEffect(() => {
    if (resList.length || myLockerIdList?.length === 0) setFirstLoading(false)
  }, [resList, myLockerIdList])

  const res = useMemo(
    () => ({ page: { totalPages, currentPage, setCurrentPage }, loading: isLoading || firstLoading, data: resList }),
    [currentPage, firstLoading, isLoading, resList, totalPages]
  )
  return res
}
