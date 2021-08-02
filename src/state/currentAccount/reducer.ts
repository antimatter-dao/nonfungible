import { createReducer } from '@reduxjs/toolkit'
import { removeCurrentAccount, saveCurrentAccount } from './actions'

export interface CurrentAccount {
  account: string
  chainId: number
}

export const initialState: CurrentAccount = {
  account: '',
  chainId: 0
}

export default createReducer(initialState, builder =>
  builder
    .addCase(removeCurrentAccount, state => {
      state.account = ''
      state.chainId = 0
    })
    .addCase(saveCurrentAccount, (state, action) => {
      const { chainId, account } = action.payload
      state.account = account
      state.chainId = chainId
    })
)
