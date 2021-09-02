import { ChainId } from '@uniswap/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
  [ChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  [ChainId.BSC]: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
  [ChainId.FANTOM]: '0xb828c456600857abd4ed6c32facc607bd0464f4f'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
