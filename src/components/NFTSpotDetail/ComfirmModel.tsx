import React, { useMemo } from 'react'
import { TYPE } from '../../theme'
import { ButtonBlack } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import styled from 'styled-components'
import { RowBetween, RowFixed } from 'components/Row'
import CurrencyLogo from 'components/CurrencyLogo'
import { AssetsParameter } from 'components/Creation'
import { BigNumber } from 'bignumber.js'
import { CurrencyAmount, JSBI, TokenAmount } from '@uniswap/sdk'
import { useCheckBuyButton, useCheckSellButton } from 'hooks/useIndexDetail'
import { useNFTApproveCallback, ApprovalState } from 'hooks/useNFTApproveCallback'
import { CHAIN_ETH_NAME, INDEX_NFT_ADDRESS, TOKEN_FLUIDITY_LIMIT } from '../../constants'
import { Dots } from 'components/swap/styleds'
import IconClose from 'components/Icons/IconClose'
import { AlertCircle } from 'react-feather'
import { useActiveWeb3React } from '../../hooks'
import { useToken } from 'hooks/Tokens'
import { useMultiApproveCallback } from 'hooks/useMultiApproveCallback'
import { LOCKER_721_ADDRESS } from 'constants/index'
import { UnClaimListProps } from 'hooks/useLocker721Detail'

export const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 40px;
  width: 100%;
  position: relative;
  max-height: 100%;
  overflow-y: auto;
  background: ${({ theme }) => theme.text1};
`
const InfoWrapper = styled(AutoColumn)`
  padding: 24px 28px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  max-height: 40vh;
  overflow-y: auto;
`

const StyledErrorLine = styled.div`
  word-wrap: break-word;
  display: flex;
  align-items: flex-start;
  margin: 0 0 5px 5px;
  > svg {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    flex-shrink: 0;
    stroke: ${({ theme }) => theme.red3};
  }
`

const RightText = styled(TYPE.small)`
  color: ${({ theme }) => theme.text6};
  max-width: 152px;
  text-align: right;
  /* align-self: flex-start; */
`

export function TokenFluidityErrorLine({ tokenFluidity }: { tokenFluidity: TokenAmount | null }) {
  // if (!tokenFluidity) return null
  if (tokenFluidity && new BigNumber(tokenFluidity.toSignificant()).isGreaterThanOrEqualTo(TOKEN_FLUIDITY_LIMIT))
    return null
  return (
    <StyledErrorLine>
      <AlertCircle />
      <TYPE.small color="text4">
        Warning: the token has insufficient liquidity on dex, please trade carefully
      </TYPE.small>
    </StyledErrorLine>
  )
}

export function BuyComfirmModel({
  isOpen,
  onDismiss,
  onConfirm,
  assetsParameters,
  number,
  tokenFluiditys,
  ethAmount,
  fee,
  // slippage,
  ETHbalance
}: {
  isOpen: boolean
  onDismiss: () => void
  onConfirm: () => void
  assetsParameters: AssetsParameter[]
  number: string
  ethAmount: CurrencyAmount | undefined
  ETHbalance: CurrencyAmount | undefined
  fee: string
  // slippage: string | number
  tokenFluiditys: (TokenAmount | null)[]
}) {
  const btn = useCheckBuyButton(ethAmount, ETHbalance, number, tokenFluiditys)
  const { chainId } = useActiveWeb3React()

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} minHeight={30} maxHeight={85} width="480px" maxWidth={480}>
      <Wrapper>
        <IconClose onEvent={onDismiss} style={{ top: 28, right: 28 }} />
        <AutoColumn gap="15px">
          <div>
            <TYPE.largeHeader fontSize={30} color="black">
              Confirmation
            </TYPE.largeHeader>
            <TYPE.darkGray fontSize={12}>Please review the following information </TYPE.darkGray>
          </div>
          <InfoWrapper gap="10px">
            <TYPE.smallGray>You will receive :</TYPE.smallGray>
            {assetsParameters
              .filter(v => v.currencyToken)
              .map(({ amount, currencyToken }, index) => (
                <div key={currencyToken?.address}>
                  <RowBetween>
                    <RowFixed>
                      <CurrencyLogo currency={currencyToken} style={{ marginRight: 10 }} />
                      <TYPE.smallGray>{currencyToken?.symbol}</TYPE.smallGray>
                    </RowFixed>
                    <RightText>
                      {amount} * {number} = {new BigNumber(amount).multipliedBy(number).toString()}
                    </RightText>
                  </RowBetween>
                  <TokenFluidityErrorLine tokenFluidity={tokenFluiditys[index]} />
                </div>
              ))}
            <RowBetween style={{ marginTop: 10 }}>
              <TYPE.smallGray>You will pay :</TYPE.smallGray>
              <RightText>
                {new BigNumber(ethAmount ? ethAmount.toSignificant(6) : '')
                  .multipliedBy(number)
                  .toFixed(6)
                  .toString()}{' '}
                {CHAIN_ETH_NAME[chainId ?? 1]}
              </RightText>
            </RowBetween>
            <RowBetween>
              <TYPE.smallGray>Fee :</TYPE.smallGray>
              <RightText>
                {CurrencyAmount.ether(JSBI.BigInt(fee ?? '0')).toSignificant(6)} {CHAIN_ETH_NAME[chainId ?? 1]}
              </RightText>
            </RowBetween>
            {/* <RowBetween>
              <TYPE.smallGray>Slippage :</TYPE.smallGray>
              <RightText>{slippage}</RightText>
            </RowBetween> */}
          </InfoWrapper>
          <ButtonBlack onClick={onConfirm} disabled={btn.disabled} height={60}>
            {btn.text}
          </ButtonBlack>
        </AutoColumn>
      </Wrapper>
    </Modal>
  )
}

export function BuyComfirmNoticeModel({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} minHeight={20} maxHeight={85} width="480px" maxWidth={480}>
      <Wrapper>
        <IconClose onEvent={onDismiss} style={{ top: 28, right: 28 }} />
        <AutoColumn gap="15px">
          <div>
            <TYPE.largeHeader fontSize={30} color="black">
              Risk Alert:
            </TYPE.largeHeader>
          </div>
          <div>I confirm I have checked the underlying assets and take my own responsibility for the trade.</div>
          <ButtonBlack onClick={onDismiss} height={60}>
            I confirm
          </ButtonBlack>
        </AutoColumn>
      </Wrapper>
    </Modal>
  )
}

export function SellComfirmModel({
  isOpen,
  onDismiss,
  onConfirm,
  assetsParameters,
  number,
  ethAmount,
  // slippage,
  // ETHbalance,
  tokenFluiditys
}: {
  isOpen: boolean
  onDismiss: () => void
  onConfirm: () => void
  assetsParameters: AssetsParameter[]
  // slippage: string | number
  number: string
  ethAmount: CurrencyAmount | undefined
  // ETHbalance: CurrencyAmount | undefined
  tokenFluiditys: (TokenAmount | null)[]
}) {
  const { chainId } = useActiveWeb3React()
  const btn = useCheckSellButton(number, tokenFluiditys)
  const [approvalState, approveCallback] = useNFTApproveCallback(INDEX_NFT_ADDRESS[chainId ?? 1])

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} minHeight={30} maxHeight={85} width="480px" maxWidth={480}>
      <Wrapper>
        <IconClose onEvent={onDismiss} style={{ top: 28, right: 28 }} />
        <AutoColumn gap="15px">
          <div>
            <TYPE.largeHeader fontSize={30} color="black">
              Confirmation
            </TYPE.largeHeader>
            <TYPE.small fontSize={12}>Please review the following information </TYPE.small>
          </div>
          <InfoWrapper gap="10px">
            <TYPE.smallGray>You will sell :</TYPE.smallGray>
            {assetsParameters
              .filter(v => v.currencyToken)
              .map(({ amount, currencyToken }, index) => (
                <div key={currencyToken?.address}>
                  <RowBetween>
                    <RowFixed>
                      <CurrencyLogo currency={currencyToken} style={{ marginRight: 10 }} />
                      <TYPE.smallGray>{currencyToken?.symbol}</TYPE.smallGray>
                    </RowFixed>
                    <RightText>
                      {amount} * {number} = {new BigNumber(amount).multipliedBy(number).toString()}
                    </RightText>
                  </RowBetween>
                  <TokenFluidityErrorLine tokenFluidity={tokenFluiditys[index]} />
                </div>
              ))}
            <RowBetween style={{ marginTop: 10 }}>
              <TYPE.smallGray>You will receive :</TYPE.smallGray>
              <RightText>
                {new BigNumber(ethAmount ? ethAmount.toSignificant(6) : '')
                  .multipliedBy(number)
                  .toFixed(6)
                  .toString()}{' '}
                {CHAIN_ETH_NAME[chainId ?? 1]}
              </RightText>
            </RowBetween>
            {/* <RowBetween>
              <TYPE.smallGray>Slippage :</TYPE.smallGray>
              <RightText>{slippage}</RightText>
            </RowBetween> */}
          </InfoWrapper>
          {approvalState === ApprovalState.PENDING ? (
            <ButtonBlack disabled={true}>
              Approving
              <Dots />
            </ButtonBlack>
          ) : approvalState === ApprovalState.NOT_APPROVED ? (
            <ButtonBlack onClick={approveCallback}>Approval</ButtonBlack>
          ) : approvalState === ApprovalState.APPROVED ? (
            <ButtonBlack onClick={onConfirm} disabled={btn.disabled} height={60}>
              {btn.text}
            </ButtonBlack>
          ) : (
            <ButtonBlack disabled={true}>UNKNOWN</ButtonBlack>
          )}
        </AutoColumn>
      </Wrapper>
    </Modal>
  )
}

function ShowTokenSymbol({ address }: { address: string }) {
  const token = useToken(address)
  return (
    <RowFixed>
      <CurrencyLogo size="16px" currency={token ?? undefined} />
      {token?.symbol}
    </RowFixed>
  )
}

export function Locker721ClaimComfirmModel({
  isOpen,
  onDismiss,
  onConfirm,
  assetsParameters
}: {
  isOpen: boolean
  onDismiss: () => void
  onConfirm: () => void
  assetsParameters: AssetsParameter[]
}) {
  const { chainId } = useActiveWeb3React()

  const assetsCurrencys: (AssetsParameter & {
    currencyAmountToken: CurrencyAmount | undefined
  })[] = useMemo(() => {
    return assetsParameters.map(item => {
      const currencyAmountToken = item.currencyToken
        ? new TokenAmount(item.currencyToken, JSBI.BigInt(item.unClaimAmount ?? 0))
        : undefined
      return { ...item, currencyAmountToken }
    })
  }, [assetsParameters])

  const { approvalStates, approveCalls } = useMultiApproveCallback(
    assetsCurrencys.map(item => item.currencyAmountToken),
    LOCKER_721_ADDRESS[chainId ?? 1]
  )
  const approveCallbacks = approveCalls()

  const btnGroups: (JSX.Element | null)[] = useMemo(() => {
    return assetsCurrencys.map((assetsCurrency, index) => {
      const approvalState = approvalStates[index]
      const approve = approveCallbacks[index]

      if (approvalState === ApprovalState.PENDING) {
        return (
          <ButtonBlack key={index} disabled>
            Allow Amitmatter to use your {assetsCurrency.currencyToken?.symbol} <Dots />
          </ButtonBlack>
        )
      }
      if (approvalState !== ApprovalState.APPROVED) {
        return (
          <ButtonBlack key={index} onClick={approve}>
            Allow Amitmatter to use your {assetsCurrency.currencyToken?.symbol}
          </ButtonBlack>
        )
      }

      return null
    })
  }, [approvalStates, approveCallbacks, assetsCurrencys])

  const btnAmountCheck: { text: string; disabled: boolean; isApprove: boolean } = useMemo(() => {
    const ret = { text: `Can't claim`, disabled: true, isApprove: false }
    if (!assetsCurrencys[0]) return ret
    const isClaimAmount = assetsCurrencys
      .map(item => {
        return item.currencyAmountToken ? item.currencyAmountToken.greaterThan(JSBI.BigInt(0)) : false
      })
      .reduce((pre, cur) => pre || cur)
    if (!isClaimAmount) return ret

    const _btnGroupsIsPass = btnGroups.map(item => item === null).reduce((pre, cur) => pre && cur)
    if (!_btnGroupsIsPass) {
      return { text: `Please approve`, disabled: true, isApprove: true }
    }

    return {
      text: 'Claim',
      disabled: false,
      isApprove: false
    }
  }, [assetsCurrencys, btnGroups])

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} minHeight={30} maxHeight={85} width="600px" maxWidth={600}>
      <Wrapper>
        <IconClose onEvent={onDismiss} style={{ top: 28, right: 28 }} />
        <AutoColumn gap="15px">
          <div>
            <TYPE.largeHeader fontSize={30} color="black">
              Confirmation
            </TYPE.largeHeader>
            <TYPE.small fontSize={12}>You will claim tokens</TYPE.small>
          </div>
          <InfoWrapper gap="10px">
            <TYPE.small>Unclaim tokens:</TYPE.small>
            {assetsCurrencys.map(item => (
              <RowBetween style={{ alignItems: 'flex-start' }} key={item.currency}>
                <TYPE.smallGray>
                  <ShowTokenSymbol address={item.currency} />
                </TYPE.smallGray>
                <RightText>{item.currencyAmountToken ? item.currencyAmountToken.toSignificant() : '0'}</RightText>
              </RowBetween>
            ))}
          </InfoWrapper>
          {btnAmountCheck.isApprove ? (
            btnGroups.map(item => item)
          ) : (
            <ButtonBlack disabled={btnAmountCheck.disabled} onClick={onConfirm} height="60px">
              {btnAmountCheck.text}
            </ButtonBlack>
          )}
        </AutoColumn>
      </Wrapper>
    </Modal>
  )
}

function TokenItem({
  dateitem,
  dataList
}: {
  dateitem: string
  dataList: {
    [index: string]: UnClaimListProps[]
  }
}) {
  const tokenAmounts = useMemo(() => {
    if (!dataList[dateitem]) return []
    return dataList[dateitem].map(item => {
      return item.currencyToken ? new TokenAmount(item.currencyToken, item.amount) : null
    })
  }, [dataList, dateitem])

  return (
    <>
      {tokenAmounts.map((item, index) => (
        <RowBetween style={{ alignItems: 'flex-start' }} key={index}>
          <TYPE.smallGray>{item?.currency.symbol}</TYPE.smallGray>
          <RightText>{item ? item.toSignificant() : '0'}</RightText>
        </RowBetween>
      ))}
    </>
  )
}

export function LockerShowTimeScheduleModel({
  isOpen,
  onDismiss,
  dataList
}: {
  isOpen: boolean
  onDismiss: () => void
  dataList: {
    [index: string]: UnClaimListProps[]
  }
}) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} minHeight={30} maxHeight={85} width="600px" maxWidth={600}>
      <Wrapper>
        <IconClose onEvent={onDismiss} style={{ top: 28, right: 28 }} />
        <AutoColumn gap="15px">
          <div>
            <TYPE.largeHeader fontSize={30} color="black">
              Locker time schedule
            </TYPE.largeHeader>
            {/* <TYPE.small fontSize={12}>You will claim tokens</TYPE.small> */}
          </div>
          <InfoWrapper gap="10px">
            <TYPE.small>Unlock datetime:</TYPE.small>
            {Object.keys(dataList).map(date => (
              <div key={date}>
                <TYPE.black fontSize={14}>{new Date(Number(date) * 1000).toLocaleString('en-US')}</TYPE.black>
                <TokenItem dateitem={date} dataList={dataList}></TokenItem>
              </div>
            ))}
            <RowBetween style={{ alignItems: 'flex-start' }}>
              <TYPE.smallGray>{/* <ShowTokenSymbol address={item.currency} /> */}</TYPE.smallGray>
              {/* <RightText>{item.currencyAmountToken ? item.currencyAmountToken.toSignificant() : '0'}</RightText> */}
            </RowBetween>
          </InfoWrapper>
          <ButtonBlack onClick={onDismiss} height="60px">
            Close
          </ButtonBlack>
        </AutoColumn>
      </Wrapper>
    </Modal>
  )
}
