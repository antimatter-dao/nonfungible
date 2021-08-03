import Web3 from 'web3'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import { appLogin } from '../../utils/option/httpFetch'
import { removeUserInfo, saveUserInfo } from './actions'
import { useDispatch } from 'react-redux'
import store from '../index'
import { UserInfo } from './actions'

export function useTimeIndex() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      setIndex(index + 1)
    }, 1000)
  }, [index])

  return index
}

export function getCurrentUserInfoSync(chainId?: number, account?: string): UserInfo | undefined {
  const allUserinfo = store.getState().userinfo
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
  const index = useTimeIndex()
  const [userinfo, setUserinfo] = useState<UserInfo | undefined>()
  const { account, chainId } = useWeb3ReactCore()

  useEffect(() => {
    if (!account || !chainId) {
      setUserinfo(undefined)
      return
    }
    const allUserinfo = store.getState().userinfo
    if (
      !allUserinfo.tokens[chainId] ||
      !allUserinfo.tokens[chainId][account] ||
      !allUserinfo.tokens[chainId][account].token
    ) {
      setUserinfo(undefined)
      return
    }
    setUserinfo(allUserinfo.tokens[chainId][account])
  }, [index, account, chainId])

  return userinfo
}

export function useLogin() {
  const { library, account, chainId } = useWeb3ReactCore()
  const signStr = 'Welcome come Antimatter'
  const dispatch = useDispatch()

  return useCallback(async () => {
    if (!account || !library || !chainId) return
    if (chainId !== 1 && chainId !== 3) return
    const userinfo = getCurrentUserInfoSync(chainId, account)
    if (userinfo && userinfo.token) return

    const web3 = new Web3(library.provider)
    try {
      const signRes = await web3.eth.personal.sign(signStr, account, '')
      const loginRes = await appLogin(account, signRes, signStr)
      if (loginRes) {
        dispatch(
          saveUserInfo({
            chainId,
            address: account,
            userinfo: {
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
    const userinfo = getCurrentUserInfoSync(chainId, account)
    if (userinfo && userinfo.token) {
      dispatch(removeUserInfo({ chainId, address: account }))
    }
  }, [account, chainId, dispatch])
}
