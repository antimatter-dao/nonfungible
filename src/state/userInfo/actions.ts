import { createAction } from '@reduxjs/toolkit'

export interface UserInfo {
  token: string
  username: string
  bio: string
  account?: string
  id?: string | number
  // avatarUrl: string
}

export const removeUserInfo = createAction<{ address: string }>('userInfo/removeUserInfo')
export const saveUserInfo = createAction<{ address: string; userInfo: UserInfo }>('userInfo/saveUserInfo')
