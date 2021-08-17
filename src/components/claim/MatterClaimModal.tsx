import React, { useCallback, useState } from 'react'
import Modal from '../Modal'
import { AutoColumn, ColumnCenter } from '../Column'
import styled from 'styled-components'
import { DataCard, CardSection, Break } from '../earn/styled'
import { RowBetween } from '../Row'
import { TYPE, ExternalLink, CloseIcon, CustomLightSpinner, UniTokenAnimated } from '../../theme'
import { ButtonPrimary } from '../Button'
import Circle from '../../assets/images/blue-loader.svg'
import { Text } from 'rebass'
import { useActiveWeb3React } from '../../hooks'
import Confetti from '../Confetti'
// import { CardBGImageSmaller } from '../earn/styled'
import { useIsTransactionPending } from '../../state/transactions/hooks'
import { getEtherscanLink, shortenAddress } from '../../utils'
import { useClaimMATTERCall } from 'hooks/useMatterClaim'
import AntimatterLogo from 'assets/svg/antimatter_logo_nft.svg'
import { CHAIN_ETH_NAME } from '../../constants'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: #fff;
  padding: 1rem;
`

const ConfirmOrLoadingWrapper = styled.div<{ activeBG: boolean }>`
  width: 100%;
  padding: 24px;
  position: relative;
  /* background: ${({ activeBG }) =>
    activeBG &&
    'radial-gradient(76.02% 75.41% at 1.84% 0%, rgba(255, 0, 122, 0.2) 0%, rgba(33, 114, 229, 0.2) 100%), #FFFFFF;'}; */
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

export default function AddressClaimModal({
  isOpen,
  onDismiss,
  claimFee
}: {
  isOpen: boolean
  claimFee: string
  onDismiss: () => void
}) {
  const { chainId, account } = useActiveWeb3React()

  // used for UI loading states
  const [attempting, setAttempting] = useState<boolean>(false)

  const [hash, setHash] = useState<string | undefined>()

  // monitor the status of the claim from contracts and txns
  const claimPending = useIsTransactionPending(hash ?? '')
  const claimConfirmed = hash && !claimPending

  // use the hash to monitor this txn

  const { callback } = useClaimMATTERCall()

  const onClaim = useCallback(() => {
    if (!callback || !Number(claimFee)) return
    setAttempting(true)
    callback()
      .then(res => {
        setHash(res)
      })
      .catch(err => {
        setAttempting(false)
        console.error(err)
      })
  }, [callback, claimFee])

  function wrappedOnDismiss() {
    setAttempting(false)
    setHash(undefined)
    onDismiss()
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      <Confetti start={Boolean(isOpen && claimConfirmed && attempting)} />
      {!attempting && (
        <ContentWrapper gap="lg">
          <ModalUpper>
            {/* <CardBGImage /> */}
            {/* <CardNoise /> */}
            <CardSection gap="md">
              <RowBetween>
                <TYPE.black fontWeight={500}>Claim MATTER Token</TYPE.black>
                <CloseIcon onClick={wrappedOnDismiss} style={{ zIndex: 99 }} stroke="black" />
              </RowBetween>
              <TYPE.black fontWeight={700} fontSize={36}>
                {claimFee} {CHAIN_ETH_NAME[chainId ?? 1]}
              </TYPE.black>
            </CardSection>
            <Break />
          </ModalUpper>
          <AutoColumn gap="md" style={{ padding: '2rem', paddingTop: '0' }} justify="center">
            {chainId === 1 && (
              <TYPE.subHeader fontWeight={500}>
                The protocol will use fees to market purchase MATTER and send to you as reward
              </TYPE.subHeader>
            )}
            <ButtonPrimary padding="16px 16px" width="100%" borderRadius="12px" mt="1rem" onClick={onClaim}>
              Claim MATTER
            </ButtonPrimary>
          </AutoColumn>
        </ContentWrapper>
      )}
      {(attempting || claimConfirmed) && (
        <ConfirmOrLoadingWrapper activeBG={true}>
          {/* <CardNoise /> */}
          {/* <CardBGImageSmaller desaturate /> */}
          <RowBetween>
            <div />
            <CloseIcon onClick={wrappedOnDismiss} style={{ zIndex: 99 }} stroke="black" />
          </RowBetween>
          <ConfirmedIcon>
            {!claimConfirmed ? (
              <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
            ) : (
              <UniTokenAnimated width="72px" src={AntimatterLogo} />
            )}
          </ConfirmedIcon>
          <AutoColumn gap="100px" justify={'center'}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader fontWeight={600} color="black">
                {claimConfirmed ? 'Claimed' : 'Claiming'}
              </TYPE.largeHeader>
              {!claimConfirmed && (
                <Text fontSize={36} color={'#ff007a'} fontWeight={800}>
                  {claimFee} {CHAIN_ETH_NAME[chainId ?? 1]}
                </Text>
              )}
              <TYPE.largeHeader fontWeight={600} color="black">
                for {shortenAddress(account ?? '')}
              </TYPE.largeHeader>
            </AutoColumn>
            {attempting && !hash && (
              <TYPE.subHeader color="black">Confirm this transaction in your wallet</TYPE.subHeader>
            )}
            {attempting && hash && !claimConfirmed && chainId && hash && (
              <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')} style={{ zIndex: 99 }}>
                View transaction on Etherscan
              </ExternalLink>
            )}
          </AutoColumn>
        </ConfirmOrLoadingWrapper>
      )}
    </Modal>
  )
}
