import { createAction } from '@reduxjs/toolkit'

export interface UserInfo {
  token: string
  username: string
  bio: string
  // avatarUrl: string
}

export const removeUserInfo = createAction<{ chainId: number; address: string }>('userinfo/removeUserInfo')
export const saveUserInfo = createAction<{ chainId: number; address: string; userinfo: UserInfo }>(
  'userinfo/saveUserInfo'
)
