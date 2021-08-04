import { useWeb3React } from '@web3-react/core'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { saveCurrentAccount } from 'state/currentAccount/actions'
// import { useLogin } from '../../state/userinfo/hooks'

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
    dispatch(saveCurrentAccount({ chainId: chainId ?? 0, account: account ?? '' }))
  }, [account, chainId, dispatch])

  return <></>
}
