import { LockerType } from 'components/Creation'
import { useEffect, useMemo, useState } from 'react'
import { getLockerIndexEventRecord } from '../utils/option/httpFetch'

export enum LockerIndexEventType {
  Created = 1,
  Transfer = 2,
  Claim = 3
}
export enum StatusType {
  Normal = 0,
  Destroy = 1
}

export interface LockerIndexData {
  eventType: LockerIndexEventType
  tokenType: LockerType
  timestamp: string
  username: string
  indexId: number
  status: StatusType
}

export function useLockerIndexData(): {
  loading: boolean
  page: {
    totalPages: number
    currentPage: number
    setCurrentPage: (page: number) => void
  }
  data: {
    lockerCreatedCount: number
    ownerCount: number
    list: LockerIndexData[]
  }
} {
  const [lockerListData, setLockerListData] = useState<LockerIndexData[]>([])
  const [lockerCreatedCount, setLockerCreatedCount] = useState(0)
  const [ownerCount, setOwnerCount] = useState(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [totalPages, setTotalPages] = useState<number>(0)
  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const indexRes = await getLockerIndexEventRecord(currentPage)
        setIsLoading(false)
        if (indexRes && (indexRes.eventList as [])) {
          setLockerCreatedCount(indexRes.lockerCreatedCount)
          setOwnerCount(indexRes.ownerCount)
          const _list: LockerIndexData[] = indexRes.eventList.map((item: any) => {
            return {
              eventType: item.eventType as LockerIndexEventType,
              tokenType: item.tokenType === 1 ? LockerType.ERC721 : LockerType.ERC1155,
              timestamp: item.timestamp,
              username: item.username,
              indexId: item.indexId,
              status: item.status
            }
          })
          setLockerListData(_list)
        }

        indexRes && setTotalPages((indexRes as any)?.pages ?? 0)
      } catch (error) {
        console.error('fetch index List', error)
      }
    })()
  }, [currentPage])
  const result = useMemo(
    () => ({
      loading: isLoading,
      data: {
        lockerCreatedCount: lockerCreatedCount,
        ownerCount,
        list: lockerListData
      },
      page: { totalPages, currentPage, setCurrentPage }
    }),
    [currentPage, isLoading, lockerCreatedCount, lockerListData, ownerCount, totalPages]
  )
  return result
}
