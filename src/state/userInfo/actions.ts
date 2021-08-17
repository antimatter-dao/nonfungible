import { createAction } from '@reduxjs/toolkit'

export interface UserInfo {
  token: string
  username: string
  bio: string
  account?: string
  chainId?: number
  id?: string | number
  // avatarUrl: string
}

export const removeUserInfo = createAction<{ chainId: number; address: string }>('userInfo/removeUserInfo')
export const saveUserInfo = createAction<{ chainId: number; address: string; userInfo: UserInfo }>(
  'userInfo/saveUserInfo'
)
