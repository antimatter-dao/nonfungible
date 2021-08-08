import React from 'react'
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
import { INDEX_NFT_ADDRESS, TOKEN_FLUIDITY_LIMIT } from '../../constants'
import { Dots } from 'components/swap/styleds'
import IconClose from 'components/Icons/IconClose'
import { AlertCircle } from 'react-feather'

export const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 40px;
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.text1};
  max-height: 100%;
  overflow-y: auto;
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
  if (tokenFluidity && tokenFluidity.greaterThan(JSBI.BigInt(TOKEN_FLUIDITY_LIMIT))) return null
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
  slippage,
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
  slippage: string | number
  tokenFluiditys: (TokenAmount | null)[]
}) {
  const btn = useCheckBuyButton(ethAmount, ETHbalance, number, tokenFluiditys)

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
                <>
                  <RowBetween key={currencyToken?.address}>
                    <RowFixed>
                      <CurrencyLogo currency={currencyToken} style={{ marginRight: 10 }} />
                      <TYPE.smallGray>{currencyToken?.symbol}</TYPE.smallGray>
                    </RowFixed>
                    <RightText>
                      {amount} * {number} = {new BigNumber(amount).multipliedBy(number).toString()}
                    </RightText>
                  </RowBetween>
                  <TokenFluidityErrorLine tokenFluidity={tokenFluiditys[index]} />
                </>
              ))}
            <RowBetween style={{ marginTop: 10 }}>
              <TYPE.smallGray>You will pay :</TYPE.smallGray>
              <RightText>
                {new BigNumber(ethAmount ? ethAmount.toSignificant(6) : '')
                  .multipliedBy(number)
                  .toFixed(6)
                  .toString()}{' '}
                ETH
              </RightText>
            </RowBetween>
            <RowBetween>
              <TYPE.smallGray>Fee :</TYPE.smallGray>
              <RightText>{CurrencyAmount.ether(JSBI.BigInt(fee ?? '0')).toSignificant(6)} ETH</RightText>
            </RowBetween>
            <RowBetween>
              <TYPE.smallGray>Slippage :</TYPE.smallGray>
              <RightText>{slippage}</RightText>
            </RowBetween>
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
  slippage,
  tokenFluiditys,
  ETHbalance
}: {
  isOpen: boolean
  onDismiss: () => void
  onConfirm: () => void
  assetsParameters: AssetsParameter[]
  slippage: string | number
  number: string
  ethAmount: CurrencyAmount | undefined
  ETHbalance: CurrencyAmount | undefined
  tokenFluiditys: (TokenAmount | null)[]
}) {
  const btn = useCheckSellButton(number, tokenFluiditys)
  const [approvalState, approveCallback] = useNFTApproveCallback(INDEX_NFT_ADDRESS)

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
                <>
                  <RowBetween key={currencyToken?.address}>
                    <RowFixed>
                      <CurrencyLogo currency={currencyToken} style={{ marginRight: 10 }} />
                      <TYPE.smallGray>{currencyToken?.symbol}</TYPE.smallGray>
                    </RowFixed>
                    <RightText>
                      {amount} * {number} = {new BigNumber(amount).multipliedBy(number).toString()}
                    </RightText>
                  </RowBetween>
                  <TokenFluidityErrorLine tokenFluidity={tokenFluiditys[index]} />
                </>
              ))}
            <RowBetween style={{ marginTop: 10 }}>
              <TYPE.smallGray>You will receive :</TYPE.smallGray>
              <RightText>
                {new BigNumber(ethAmount ? ethAmount.toSignificant(6) : '')
                  .multipliedBy(number)
                  .toFixed(6)
                  .toString()}{' '}
                ETH
              </RightText>
            </RowBetween>
            <RowBetween>
              <TYPE.smallGray>Slippage :</TYPE.smallGray>
              <RightText>{slippage}</RightText>
            </RowBetween>
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
