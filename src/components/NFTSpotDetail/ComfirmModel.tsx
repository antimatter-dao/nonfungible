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
import { CurrencyAmount, JSBI } from '@uniswap/sdk'
import { useCheckBuyButton } from 'hooks/useIndexDetail'
import { useNFTApproveCallback, ApprovalState } from 'hooks/useNFTApproveCallback'
import { INDEX_NFT_ADDRESS } from '../../constants'
import { Dots } from 'components/swap/styleds'

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

const RightText = styled(TYPE.small)`
  color: ${({ theme }) => theme.text6};
  max-width: 152px;
  text-align: right;
  /* align-self: flex-start; */
`

export function BuyComfirmModel({
  isOpen,
  onDismiss,
  onConfirm,
  assetsParameters,
  number,
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
}) {
  const btn = useCheckBuyButton(ethAmount, ETHbalance, number)

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} minHeight={30} maxHeight={85} width="480px" maxWidth={480}>
      <Wrapper>
        <AutoColumn gap="15px">
          <div>
            <TYPE.largeHeader fontSize={30} color="black">
              Confirmation
            </TYPE.largeHeader>
            <TYPE.small fontSize={12}>Please review the following information </TYPE.small>
          </div>
          <InfoWrapper gap="10px">
            <TYPE.smallGray>You will receive :</TYPE.smallGray>
            {assetsParameters
              .filter(v => v.currencyToken)
              .map(({ amount, currencyToken }) => (
                <RowBetween key={currencyToken?.address}>
                  <RowFixed>
                    <CurrencyLogo currency={currencyToken} style={{ marginRight: 10 }} />
                    <TYPE.smallGray>{currencyToken?.symbol}</TYPE.smallGray>
                  </RowFixed>
                  <RightText>
                    {amount} * {number} = {new BigNumber(amount).multipliedBy(number).toString()}
                  </RightText>
                </RowBetween>
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

export function SellComfirmModel({
  isOpen,
  onDismiss,
  onConfirm,
  assetsParameters,
  number,
  ethAmount,
  slippage,
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
}) {
  const btn = useCheckBuyButton(ethAmount, ETHbalance, number)
  const [approvalState, approveCallback] = useNFTApproveCallback(INDEX_NFT_ADDRESS)

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} minHeight={30} maxHeight={85} width="480px" maxWidth={480}>
      <Wrapper>
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
              .map(({ amount, currencyToken }) => (
                <RowBetween key={currencyToken?.address}>
                  <RowFixed>
                    <CurrencyLogo currency={currencyToken} style={{ marginRight: 10 }} />
                    <TYPE.smallGray>{currencyToken?.symbol}</TYPE.smallGray>
                  </RowFixed>
                  <RightText>
                    {amount} * {number} = {new BigNumber(amount).multipliedBy(number).toString()}
                  </RightText>
                </RowBetween>
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
