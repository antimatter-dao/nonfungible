import { useWeb3React } from '@web3-react/core'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useSingleContractMultipleData } from 'state/multicall/hooks'
import { saveUserInfo, UserInfo } from 'state/userinfo/actions'
import { positionListFetch, indexListFetch, userInfoFetch, UserInfoQuery } from 'utils/option/httpFetch'
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
    return positionListRes.map(({ result }, idx) =>
      formatNFTCardDetail(positionIdList[idx][0], result ? result[0] : undefined, tokens)
    )
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

export function useUserInfoUpdate(userInfo: UserInfo | undefined) {
  const { account, chainId } = useWeb3React()
  const dispatch = useDispatch()
  const callback = useCallback(
    async (params: UserInfoQuery) => {
      const res: any = await userInfoFetch(userInfo?.token, params)
      if (res && userInfo && chainId && account) {
        console.log(res)
        dispatch(
          saveUserInfo({
            chainId,
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
    [account, chainId, dispatch, userInfo]
  )

  return useMemo(() => {
    return { updateUserInfoCallback: callback }
  }, [callback])
}
