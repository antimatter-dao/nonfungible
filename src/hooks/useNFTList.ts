import { AssetsParameter } from 'components/Creation'
import { useEffect, useState, useMemo } from 'react'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { useSingleContractMultipleData } from 'state/multicall/hooks'
import { allNFTFetch } from 'utils/option/httpFetch'
import { useAllTokens } from './Tokens'
import { useIndexNFTContract } from './useContract'
import { toNumber } from './useIndexDetail'

export default function useNFTList() {
  const [nftIdList, setNftIdList] = useState<string[][]>([])
  const tokens = useAllTokens()

  useEffect(() => {
    ;(async () => {
      try {
        const positionList = await allNFTFetch()
        const idList: string[][] | undefined = positionList?.records?.map(({ indexId }: { indexId: string }) => [
          indexId
        ])
        idList && setNftIdList(idList)
      } catch (error) {
        console.error('fetch NFT List', error)
      }
    })()
  }, [])

  const contract = useIndexNFTContract()
  const nftRes = useSingleContractMultipleData(contract, 'getIndex', nftIdList)

  return useMemo(() => {
    nftRes.map((res, idx) => {
      if (!res.result) {
        return undefined
      }
      const nft = res.result[0]
      const metadata = JSON.parse(nft.metadata)
      const assetsParameters = nft.underlyingAmounts.map(
        (val: any, index: number): AssetsParameter => {
          let _currencyToken = undefined
          if (tokens) {
            _currencyToken = tokens[val.currency] as WrappedTokenInfo
            if (!_currencyToken) _currencyToken = tokens[Object.keys(tokens)[0]] as WrappedTokenInfo
          }

          return {
            amount: toNumber(val.toString(), _currencyToken),
            currency: nft.underlyingTokens[index],
            currencyToken: _currencyToken
          }
        }
      )
      return {
        name: nft.name,
        description: metadata.description,
        color: metadata.color,
        creator: nft.creator,
        creatorId: idx + '',
        creatorName: 'jack',
        assetsParameters
      }
    })
  }, [nftRes, tokens])
}
