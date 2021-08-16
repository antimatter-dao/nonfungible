import { ChainId, Token, ETHER } from '@uniswap/sdk'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { ETH_CALL, ETH_PUT, MATTER_CALL, UNI, USDT } from '../index'

interface Currencies {
  ETH_CALL?: Token
  ETH_PUT?: Token
  MATTER?: Token
  DAI?: Token
  ETHER?: Token
}

export const currencies: {
  [chainId in ChainId]?: Currencies
} = {
  [ChainId.MAINNET]: {
    ETHER: wrappedCurrency(ETHER, ChainId.MAINNET)
  },
  [ChainId.BSC]: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ETHER: wrappedCurrency(ETHER, ChainId.MAINNET)!
  }
}
export enum LPT_TYPE {
  ETH_CALL_DAI = '+ETH($1000)/USDT LP Pool',
  ETH_PUT_DAI = '-ETH($3000)/USDT LP Pool',
  MATTER_ETH = 'MATTER/ETH LP Pool',
  MATTER_CALL_MATTER = '+MATTER($1)/MATTER LP Pool'
}

export enum LPT_CYCLE_REWARDS {
  ETH_CALL_DAI = 1000,
  ETH_PUT_DAI = 1000,
  MATTER_ETH = 1000
}

export const LPT_PAIRS: {
  [chainId in ChainId]?: {
    [lptType in LPT_TYPE]: { title: string; currencyA: Token | undefined; currencyB: Token | undefined }
  }
} = {
  [ChainId.MAINNET]: {
    [LPT_TYPE.ETH_CALL_DAI]: {
      title: '+ETH($1000)/USDT LP Pool',
      currencyA: ETH_CALL,
      currencyB: USDT
    },
    [LPT_TYPE.ETH_PUT_DAI]: {
      title: '-ETH($3000)/USDT LP Pool',
      currencyA: ETH_PUT,
      currencyB: USDT
    },
    [LPT_TYPE.MATTER_ETH]: {
      title: 'MATTER/ETH LP Pool',
      currencyA: UNI[ChainId.MAINNET],
      currencyB: currencies[ChainId.MAINNET]?.ETHER
    },
    [LPT_TYPE.MATTER_CALL_MATTER]: {
      title: '+MATTER($1)/MATTER LP Pool',
      currencyA: MATTER_CALL,
      currencyB: UNI[ChainId.MAINNET]
    }
  },
  [ChainId.BSC]: {
    [LPT_TYPE.ETH_CALL_DAI]: {
      title: '+ETH/DAI>+MATTER($1)',
      currencyA: currencies[ChainId.BSC]?.ETH_CALL,
      currencyB: currencies[ChainId.BSC]?.DAI
    },
    [LPT_TYPE.ETH_PUT_DAI]: {
      title: '-ETH/DAI>+MATTER($1)',
      currencyA: currencies[ChainId.BSC]?.ETH_PUT,
      currencyB: currencies[ChainId.BSC]?.DAI
    },
    [LPT_TYPE.MATTER_ETH]: {
      title: 'MATTER/ETH>+MATTER($1)',
      currencyA: currencies[ChainId.BSC]?.MATTER,
      currencyB: currencies[ChainId.BSC]?.ETHER
    },
    [LPT_TYPE.MATTER_CALL_MATTER]: {
      title: '+MATTER($1)/MATTER LP Pool',
      currencyA: currencies[ChainId.BSC]?.MATTER,
      currencyB: currencies[ChainId.BSC]?.ETHER
    }
  }
}

export const LPT_RewardPerDay = {
  [LPT_TYPE.ETH_CALL_DAI]: '1000',
  [LPT_TYPE.ETH_PUT_DAI]: '1000',
  [LPT_TYPE.MATTER_ETH]: '1000',
  [LPT_TYPE.MATTER_CALL_MATTER]: '333'
}
