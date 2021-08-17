import Web3 from 'web3'
import { useSelector } from 'react-redux'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import { appLogin } from '../../utils/option/httpFetch'
import { removeUserInfo, saveUserInfo } from './actions'
import { useDispatch } from 'react-redux'
import store from '../index'
import { UserInfo } from './actions'
import { useHistory } from 'react-router-dom'
import { UserState } from './reducer'

export function getCurrentUserInfoSync(chainId?: number, account?: string): UserInfo | undefined {
  const allUserInfo = store.getState()?.userInfo
  if (!allUserInfo) return undefined
  if (!account || !chainId) {
    const { account, chainId } = store.getState().currentAccount
    if (!allUserInfo.tokens[chainId]) return undefined
    if (!allUserInfo.tokens[chainId][account]) return undefined
    return allUserInfo.tokens[chainId][account]
  } else {
    if (!allUserInfo.tokens[chainId]) return undefined
    if (!allUserInfo.tokens[chainId][account]) return undefined
    return allUserInfo.tokens[chainId][account]
  }
}

export function clearLoginStoreSync() {
  const userInfo = getCurrentUserInfoSync()
  store.dispatch({
    type: 'userInfo/removeUserInfo',
    payload: {
      chainId: userInfo && userInfo.chainId ? userInfo.chainId : 0,
      address: userInfo && userInfo.account ? userInfo.account : ''
    }
  })
  window.location.href = '#/'
}

export function useCurrentUserInfo(): UserInfo | undefined {
  const allUserInfo = useSelector((store: { userInfo: UserState }) => store.userInfo)
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

enum loginNoticeState {
  Close,
  Logging,
  LoginSuccess,
  LoginFail
}

export function useLogin(): {
  login: () => void
  loginState: [loginNoticeState, () => void]
} {
  const { library, account, chainId } = useWeb3ReactCore()
  const signStr = 'Welcome come Antimatter'
  const dispatch = useDispatch()
  const [loginState, setLoginState] = useState(loginNoticeState.Close)
  const resetLoginState = useCallback(() => {
    setLoginState(loginNoticeState.Close)
  }, [setLoginState])

  const login = useCallback(async () => {
    if (!account || !library || !chainId) return
    if (chainId !== 1 && chainId !== 56) return
    const userInfo = getCurrentUserInfoSync(chainId, account)
    if (userInfo && userInfo.token) return

    const web3 = new Web3(library.provider)
    try {
      const signRes = await web3.eth.personal.sign(signStr, account, '')
      setLoginState(loginNoticeState.Logging)
      appLogin(chainId, account, signRes, signStr)
        .then(loginRes => {
          setLoginState(loginNoticeState.LoginSuccess)
          dispatch(
            saveUserInfo({
              chainId,
              address: account,
              userInfo: {
                token: loginRes.token ?? '',
                username: loginRes.username ?? '',
                bio: loginRes.description ?? '',
                id: loginRes.id ?? ''
              }
            })
          )
        })
        .catch(error => {
          console.error('login', error)
          setLoginState(loginNoticeState.LoginFail)
        })
    } catch (error) {
      console.error('login', error)
    }
  }, [account, library, chainId, dispatch])

  return {
    login,
    loginState: [loginState, resetLoginState]
  }
}

export function useLogOut() {
  const { account, chainId, deactivate } = useWeb3ReactCore()
  const dispatch = useDispatch()
  const history = useHistory()

  return useCallback(async () => {
    if (!account || !chainId) return
    if (chainId !== 1 && chainId !== 56) return
    const userInfo = getCurrentUserInfoSync(chainId, account)
    if (userInfo && userInfo.token) {
      dispatch(removeUserInfo({ chainId, address: account }))
    }
    deactivate()
    if (history && history.location.pathname.indexOf('/profile') === 0) {
      history.replace('/')
    }
  }, [account, chainId, deactivate, dispatch, history])
}
