import { createReducer } from '@reduxjs/toolkit'
import { saveUserInfo, removeUserInfo, UserInfo } from './actions'

export interface UserState {
  tokens: {
    [address: string]: UserInfo
  }
}

export const initialState: UserState = {
  tokens: {}
}

export default createReducer(initialState, builder =>
  builder
    .addCase(removeUserInfo, (state, action) => {
      const { address } = action.payload
      if (state.tokens) delete state.tokens[address]
    })
    .addCase(saveUserInfo, (state, action) => {
      const { address, userInfo } = action.payload
      state.tokens = {
        ...state.tokens,
        [address]: Object.assign(userInfo, { account: address })
      }
    })
)
