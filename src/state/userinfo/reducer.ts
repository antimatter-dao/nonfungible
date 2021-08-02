import { createReducer } from '@reduxjs/toolkit'
import { saveUserInfo, removeUserInfo, UserInfo } from './actions'

export interface UserState {
  tokens: {
    [chainId: number]: {
      [address: string]: UserInfo
    }
  }
}

export const initialState: UserState = {
  tokens: {}
}

export default createReducer(initialState, builder =>
  builder
    .addCase(removeUserInfo, (state, action) => {
      const { chainId, address } = action.payload
      if (state.tokens[chainId] && state.tokens[chainId][address]) delete state.tokens[chainId][address]
    })
    .addCase(saveUserInfo, (state, action) => {
      const { chainId, address, userinfo } = action.payload
      state.tokens = {
        [chainId]: {
          [address]: userinfo
        }
      }
    })
)
