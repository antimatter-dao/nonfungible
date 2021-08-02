import { createAction } from '@reduxjs/toolkit'

export const removeCurrentAccount = createAction('account/removeCurrentAccount')
export const saveCurrentAccount = createAction<{ chainId: number; account: string }>('account/saveCurrentAccount')
