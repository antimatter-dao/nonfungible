import Web3 from 'web3'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { useCallback } from 'react'

export function useLogin() {
  const { library, account } = useWeb3ReactCore()
  const signStr = 'Welcome come Antimatter'

  return useCallback(() => {
    if (!account || !library) return
    const web3 = new Web3(library.provider)
    web3.eth.personal
      .sign(signStr, account, '')
      .then(res => {
        console.log('🚀 ~ file: hooks.ts ~ line 13 ~ web3.eth.personal.sign ~ res', res)
      })
      .catch(err => {
        console.error(err)
      })
  }, [account, library])
}
