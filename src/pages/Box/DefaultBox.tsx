import React /*, { useState }*/ from 'react'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import { /* ButtonBlack,*/ Base } from 'components/Button'
import { OutlineCard } from 'components/Card'
import { RowBetween } from 'components/Row'
import { TimerCapsule } from 'components/NFTCard/Capsule'
import { Dots } from 'components/swap/styleds'

export default function DefaultBox() {
  // const [hasNFT] = useState(true)

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
        <TimerCapsule timeLeft={1630877914} />
      </div>
      <div>
        <OutlineCard color="#dddddd">
          <RowBetween>
            <TYPE.black fontWeight={400}>Price per Box</TYPE.black>
            <TYPE.black fontWeight={400}>10 MATTER</TYPE.black>
          </RowBetween>
        </OutlineCard>
        <TYPE.smallGray marginTop="8px">1 box for 1 contract address</TYPE.smallGray>
      </div>
      <Base disabled backgroundColor="#aaaaaa">
        Coming Soon <Dots />
      </Base>
      {/* {hasNFT ? (
        <Base disabled backgroundColor="#aaaaaa">
          You already have nft
        </Base>
      ) : (
        <ButtonBlack>Buy</ButtonBlack>
      )} */}
    </AutoColumn>
  )
}
