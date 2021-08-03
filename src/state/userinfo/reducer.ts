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
      const { chainId, address, userInfo } = action.payload

      if (Object.keys(state.tokens).length === 0) {
        state.tokens = {
          [chainId]: {
            [address]: userInfo
          }
        }
        return
      }
      const currentUser: UserState['tokens'] = {}
      for (const _chainid of Object.keys(state.tokens)) {
        let _curr = {}
        if (parseInt(_chainid) === chainId) {
          _curr = {
            ...state.tokens[chainId],
            [address]: userInfo
          }
        } else {
          _curr = state.tokens[chainId][address]
        }
        currentUser[parseInt(_chainid)] = _curr
      }
      state.tokens = currentUser
    })
)
