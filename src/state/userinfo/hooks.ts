import Web3 from 'web3'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { useCallback } from 'react'
import { appLogin } from '../../utils/option/httpFetch'
import { saveUserInfo } from './actions'
import { useDispatch } from 'react-redux'
import store from '../index'
import { UserInfo } from './actions'

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
  const allUserinfo = store.getState().userinfo
  const { account, chainId } = useWeb3ReactCore()
  if (!account || !chainId) return undefined
  if (!allUserinfo.tokens[chainId] || !allUserinfo.tokens[chainId][account]) return undefined
  return allUserinfo.tokens[chainId][account]
}

export function useLogin() {
  const { library, account, chainId } = useWeb3ReactCore()
  const signStr = 'Welcome come Antimatter'
  const dispatch = useDispatch()

  return useCallback(async () => {
    if (!account || !library || !chainId) return
    if (chainId !== 1 && chainId !== 3) return
    const userinfo = getCurrentUserInfoSync(chainId, account)
    if (userinfo) return

    const web3 = new Web3(library.provider)
    try {
      const signRes = await web3.eth.personal.sign(signStr, account, '')
      const loginRes = await appLogin(account, signRes, signStr)
      if (loginRes) {
        dispatch(
          saveUserInfo({
            chainId,
            address: account,
            userinfo: { token: loginRes as string, username: '', bio: '', avatarUrl: '' }
          })
        )
      }
    } catch (error) {
      console.error('login', error)
    }
  }, [account, library, chainId, dispatch])
}
