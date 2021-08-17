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
      if (state.tokens) delete state.tokens[chainId][address]
    })
    .addCase(saveUserInfo, (state, action) => {
      const { chainId, address, userInfo } = action.payload

      const _tokens = state.tokens
      if (_tokens[chainId]) {
        _tokens[chainId][address] = Object.assign(userInfo, { chainId, account: address })
      } else {
        _tokens[chainId] = {
          [address]: Object.assign(userInfo, { chainId, account: address })
        }
      }
      state.tokens = _tokens
    })
)
