import { useEffect } from 'react'
import { UserInfo } from 'state/userinfo/actions'
// import { positionFetch } from 'utils/option/httpFetch'

export default async function usePositionList(userInfo: UserInfo | undefined) {
  useEffect(() => {
    ;(async () => {
      try {
        // const positionList = await positionFetch(userInfo?.token)
      } catch (error) {
        console.error('fetch positionList', error)
      }
    })()
  }, [userInfo])
}
