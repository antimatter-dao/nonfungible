import { useWeb3React } from '@web3-react/core'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import store from 'state'
import { saveCurrentAccount } from 'state/currentAccount/actions'
// import { useLogin } from '../../state/userInfo/hooks'

export default function Login() {
  const { account, chainId } = useWeb3React()
  const dispatch = useDispatch()

  // TODO getCurrentUserInfoSync After the wallet is connected, it will be available after the effect is maintained.
  // const login = useLogin()
  // useEffect(() => {
  //   setTimeout(() => {
  //     const userInfo = getCurrentUserInfoSync()
  //     if (!userInfo) login()
  //   }, 2000)
  //   login()
  // }, [login])

  useEffect(() => {
    const currentAccount = store.getState().currentAccount
    if ((chainId === 1 || chainId === 56) && currentAccount.chainId && currentAccount.chainId !== chainId) {
      window.location.href = '#/'
      window.location.reload()
    }
    dispatch(saveCurrentAccount({ chainId: chainId ?? 0, account: account ?? '' }))
  }, [account, chainId, dispatch])

  return <></>
}
