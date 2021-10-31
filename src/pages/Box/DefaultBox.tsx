import React from 'react'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import { ButtonBlack, Base } from 'components/Button'
import { OutlineCard } from 'components/Card'
import { RowBetween } from 'components/Row'
import { ApprovalState } from 'hooks/useApproveCallback'
import { useWalletModalToggle } from 'state/application/hooks'
import { Dots } from 'components/swap/styleds'
import { JSBI, TokenAmount } from '@uniswap/sdk'
// import { TimerCapsule } from 'components/NFTCard/Capsule'

export default function DefaultBox({
  remainingNFT = true,
  participated,
  approval,
  drawDepositAmount,
  onApprove,
  onDraw,
  account,
  matterBalance
}: {
  remainingNFT: any
  participated: boolean
  drawDepositAmount: string
  approval: ApprovalState
  onApprove: () => void
  onDraw: () => void
  account: string | null | undefined
  matterBalance: TokenAmount | undefined
}) {
  const toggleWalletModal = useWalletModalToggle()
  return (
    <AutoColumn gap="46px">
      <div>
        <RowBetween style={{ marginBottom: 8 }}>
          <TYPE.black fontWeight={700} fontSize={30} className="title">
            Antimatter NFT
          </TYPE.black>
          <TYPE.black fontWeight={400} fontSize={24} className="phase">
            Phase #1
          </TYPE.black>
        </RowBetween>
        {/* <TimerCapsule timeLeft={1630877914} /> */}
      </div>
      <div>
        <OutlineCard color="#dddddd">
          <RowBetween>
            <TYPE.black fontWeight={400}>Price per Box</TYPE.black>
            <TYPE.black fontWeight={400}>{drawDepositAmount ?? '--'} MATTER</TYPE.black>
          </RowBetween>
        </OutlineCard>
        <TYPE.smallGray marginTop="8px">1 box for 1 contract address</TYPE.smallGray>
      </div>
      {!account ? (
        <ButtonBlack onClick={toggleWalletModal}>Connect</ButtonBlack>
      ) : !remainingNFT ? (
        <Base disabled backgroundColor="#aaaaaa">
          Closed
        </Base>
      ) : participated ? (
        <Base disabled backgroundColor="#aaaaaa">
          You already have nft
        </Base>
      ) : matterBalance?.lessThan(JSBI.BigInt(drawDepositAmount)) ? (
        <ButtonBlack disabled>Insufficient MATTER Balance</ButtonBlack>
      ) : approval === ApprovalState.APPROVED ? (
        <ButtonBlack onClick={onDraw}>Buy</ButtonBlack>
      ) : approval === ApprovalState.PENDING ? (
        <ButtonBlack disabled>
          Approve
          <Dots />
        </ButtonBlack>
      ) : approval === ApprovalState.UNKNOWN ? (
        <ButtonBlack disabled>
          Loading
          <Dots />
        </ButtonBlack>
      ) : (
        <ButtonBlack onClick={onApprove}>Approve</ButtonBlack>
      )}
    </AutoColumn>
  )
}
