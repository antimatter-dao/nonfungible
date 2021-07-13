import React from 'react'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useToggleCreationModal } from 'state/application/hooks'
import styled from 'styled-components'

import Modal from '../Modal'

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
  background: ${({ theme }) => theme.gradient1};
`

export default function CreationNFTModal() {
  const creationModalOpen = useModalOpen(ApplicationModal.Creation)
  const toggleCreationModal = useToggleCreationModal()

  return (
    <Modal isOpen={creationModalOpen} onDismiss={toggleCreationModal} minHeight={50} maxHeight={90} max-width={560}>
      <Wrapper>create</Wrapper>
    </Modal>
  )
}
