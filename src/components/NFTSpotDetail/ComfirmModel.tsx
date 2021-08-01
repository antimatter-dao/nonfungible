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
  number
}: {
  isOpen: boolean
  onDismiss: () => void
  onConfirm: () => void
  assetsParameters: AssetsParameter[]
  number: string
}) {
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
                <>
                  <RowBetween>
                    <RowFixed>
                      <CurrencyLogo currency={currencyToken} style={{ marginRight: 10 }} />
                      <TYPE.smallGray>{currencyToken?.symbol}</TYPE.smallGray>
                    </RowFixed>
                    <RightText>{new BigNumber(amount).multipliedBy(number).toString()}</RightText>
                  </RowBetween>
                </>
              ))}
            <RowBetween style={{ marginTop: 10 }}>
              <TYPE.smallGray>You will pay :</TYPE.smallGray>
              <RightText>10 ETH</RightText>
            </RowBetween>
          </InfoWrapper>
          <ButtonBlack onClick={onConfirm} height={60}>
            Confirm
          </ButtonBlack>
        </AutoColumn>
      </Wrapper>
    </Modal>
  )
}
