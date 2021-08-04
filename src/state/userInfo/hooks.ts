import Web3 from 'web3'
import { useSelector } from 'react-redux'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import { appLogin } from '../../utils/option/httpFetch'
import { removeUserInfo, saveUserInfo } from './actions'
import { useDispatch } from 'react-redux'
import store from '../index'
import { UserInfo } from './actions'

export function getCurrentUserInfoSync(chainId?: number, account?: string): UserInfo | undefined {
  const allUserinfo = store.getState().userInfo
  if (!chainId || !account) {
    const { account, chainId } = store.getState().currentAccount
    if (!account || !chainId) return undefined
    if (!allUserinfo.tokens[chainId] || !allUserinfo.tokens[chainId][account]) return undefined
    return allUserinfo.tokens[chainId][account]
  } else {
    if (!allUserinfo.tokens[chainId] || !allUserinfo.tokens[chainId][account]) return undefined
    return allUserinfo.tokens[chainId][account]
  }
}

export function useCurrentUserInfo(): UserInfo | undefined {
  const allUserInfo = useSelector((store: { userInfo: any }) => store.userInfo)
  const [userInfo, setUserinfo] = useState<UserInfo | undefined>()
  const { account, chainId } = useWeb3ReactCore()

  useEffect(() => {
    if (!account || !chainId) {
      setUserinfo(undefined)
      return
    }
    if (
      !allUserInfo.tokens[chainId] ||
      !allUserInfo.tokens[chainId][account] ||
      !allUserInfo.tokens[chainId][account].token
    ) {
      setUserinfo(undefined)
      return
    }
    setUserinfo(allUserInfo.tokens[chainId][account])
  }, [allUserInfo, account, chainId])

  return userInfo
}

export function useLogin() {
  const { library, account, chainId } = useWeb3ReactCore()
  const signStr = 'Welcome come Antimatter'
  const dispatch = useDispatch()

  return useCallback(async () => {
    if (!account || !library || !chainId) return
    if (chainId !== 1 && chainId !== 3) return
    const userInfo = getCurrentUserInfoSync(chainId, account)
    if (userInfo && userInfo.token && userInfo) return

    const web3 = new Web3(library.provider)
    try {
      const signRes = await web3.eth.personal.sign(signStr, account, '')
      const loginRes = await appLogin(account, signRes, signStr)
      if (loginRes) {
        dispatch(
          saveUserInfo({
            chainId,
            address: account,
            userInfo: {
              token: loginRes.token ?? '',
              username: loginRes.username ?? '',
              bio: loginRes.description ?? '',
              id: loginRes.id ?? '',
              account: account
            }
          })
        )
      }
    } catch (error) {
      console.error('login', error)
    }
  }, [account, library, chainId, dispatch])
}

export function useLogOut() {
  const { account, chainId } = useWeb3ReactCore()
  const dispatch = useDispatch()

  return useCallback(async () => {
    if (!account || !chainId) return
    if (chainId !== 1 && chainId !== 3) return
    const userInfo = getCurrentUserInfoSync(chainId, account)
    if (userInfo && userInfo.token) {
      dispatch(removeUserInfo({ chainId, address: account }))
    }
  }, [account, chainId, dispatch])
}
