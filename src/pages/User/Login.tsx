import React from 'react'
import { useLogin } from '../../state/users/hooks'

export default function Login() {
  const login = useLogin()
  console.log('🚀 ~ file: Login.tsx ~ line 6 ~ Login ~ login', login)
  // login()

  return <></>
}
