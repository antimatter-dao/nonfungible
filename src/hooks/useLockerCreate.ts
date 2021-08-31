import { useTransactionAdder } from '../state/transactions/hooks'
import { useLocker721NFTContract } from './useContract'
import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useMemo } from 'react'
import { CurrencyAmount, JSBI, TokenAmount } from '@uniswap/sdk'
import { TOKEN_FLUIDITY_LIMIT } from '../constants'
import { BigNumber } from 'bignumber.js'
import { CreateLockerData, TimeScheduleType } from 'components/Creation'
import { tryParseAmount } from 'state/swap/hooks'
import { ApprovalState } from './useApproveCallback'

export enum LockerCreateCallbackState {
  INVALID,
  LOADING,
  VALID
}

interface Locker721CreateParam {
  name: string
  metadata: string
  underlyingTokens: string[]
  underlyingAmounts: string[]
  claimType: number
}

interface Locker721CreateClaimParam {
  token: string
  amount: string
  claimAt: number
}

export const getLockerClaimParam = (data: CreateLockerData): Locker721CreateClaimParam[] => {
  if (data.schedule === TimeScheduleType.Flexible) {
    return data.assetsParameters.map(item => {
      return {
        token: item.currency,
        amount: tryParseAmount(item.amount, item.currencyToken)?.raw.toString() ?? '',
        claimAt: 0
      }
    })
  } else if (data.schedule === TimeScheduleType.OneTIme) {
    const unLockTIme = data.unlockData.datetime
      ? parseInt(Number(data.unlockData.datetime.getTime() / 1000).toString())
      : 0
    return data.assetsParameters.map(item => {
      return {
        token: item.currency,
        amount: tryParseAmount(item.amount, item.currencyToken)?.raw.toString() ?? '',
        claimAt: unLockTIme
      }
    })
  } else {
    let ret: Locker721CreateClaimParam[] = []
    const numbers = Number(data.unlockData.unlockNumbers)
    let idx = 0
    const nowTIme = parseInt(Number(new Date().getTime() / 1000).toString())
    while (idx < numbers) {
      idx++
      const unLockTIme = nowTIme + idx * 86400 * Number(data.unlockData.unlockInterval)
      const _item = data.assetsParameters.map(item => {
        const _allAmount = tryParseAmount(item.amount, item.currencyToken)?.raw.toString() ?? ''
        let _amount = _allAmount
        if (_allAmount) {
          _amount = JSBI.divide(JSBI.BigInt(_allAmount), JSBI.BigInt(numbers)).toString()
        }
        return {
          token: item.currency,
          amount: _amount,
          claimAt: unLockTIme
        }
      })
      ret = [...ret, ..._item]
    }
    return ret
  }
}

interface LockerCreateButtonProps {
  text: string
  disabled: boolean
}
export function useCheckLockerCreateButton(
  selectAllTokens: (CurrencyAmount | undefined)[],
  selectCurrencyBalances: (CurrencyAmount | undefined)[],
  approvalStates: ApprovalState[]
): LockerCreateButtonProps {
  return useMemo(() => {
    const ret: LockerCreateButtonProps = {
      text: 'Confirm',
      disabled: false
    }
    for (let index = 0; index < selectAllTokens.length; index++) {
      const currencyToken = selectAllTokens[index]
      const currencyBalances = selectCurrencyBalances[index]
      const approvalState = approvalStates[index]
      if (currencyBalances?.lessThan(currencyToken ?? JSBI.BigInt(0))) {
        ret.text = 'Insufficient balance'
        ret.disabled = true
        return ret
      }
      if (approvalState !== ApprovalState.APPROVED) {
        ret.text = 'Need to approve'
        ret.disabled = true
        return ret
      }
    }
    return ret
  }, [approvalStates, selectAllTokens, selectCurrencyBalances])
}

export function useLockerCreateCall(): {
  state: LockerCreateCallbackState
  callback:
    | undefined
    | ((createParam: Locker721CreateParam, claimParam: Locker721CreateClaimParam[]) => Promise<string>)
  error: string | null
} {
  const addTransaction = useTransactionAdder()
  const contract = useLocker721NFTContract()

  return {
    state: LockerCreateCallbackState.VALID,
    callback: async function onCreate(createParam, claimParam): Promise<string> {
      if (!contract) {
        throw new Error('Unexpected error. Contract error')
      }
      const _createParam = Object.values(createParam)
      const _claimParam = claimParam.map(item => Object.values(item))
      console.log(
        '🚀 ~ file: useLockerCreate.ts ~ line 97 ~ onCreate ~ _createParam',
        _createParam,
        _claimParam,
        JSON.stringify(_createParam),
        JSON.stringify(_claimParam)
      )

      return contract.estimateGas.create(_createParam, _claimParam, {}).then(estimatedGasLimit => {
        return contract
          .create(_createParam, _claimParam, { gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Create Locker`
            })
            return response.hash
          })
      })
    },
    error: ''
  }
}

interface LockerCreateButtonProps {
  text: string
  disabled: boolean
}
export function useCheckSpotCreateButton(tokenFluiditys: (TokenAmount | null)[]): LockerCreateButtonProps {
  return useMemo(() => {
    const ret: LockerCreateButtonProps = {
      text: 'Confirm',
      disabled: false
    }
    if (!tokenFluiditys) {
      ret.disabled = true
      ret.text = 'Please waiting'
      return ret
    }
    for (const item of tokenFluiditys) {
      if (item === null) {
        ret.disabled = true
        ret.text = 'Please waiting'
        return ret
      }
    }
    const Insufficients = tokenFluiditys.filter((item: TokenAmount | null) => {
      return !item || new BigNumber(item.toSignificant()).isLessThan(TOKEN_FLUIDITY_LIMIT)
    })
    if (Insufficients.length) {
      ret.disabled = true
      ret.text = 'Insufficient liquidity'
      return ret
    }
    return ret
  }, [tokenFluiditys])
}
