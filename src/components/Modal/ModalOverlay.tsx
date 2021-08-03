import React from 'react'
import { useTransition } from 'react-spring'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { StyledDialogOverlay, AnimatedDialogContent } from '.'

const StyledDialogContent = styled(AnimatedDialogContent)`
  &[data-reach-dialog-content] {
    background: transparent;
    width: max-content;
    margin: 0 auto;
    padding: 0;
  }
`

export default function ModalOverlay({
  children,
  isOpen,
  zIndex,
  onDismiss
}: {
  children: React.ReactNode
  isOpen: boolean
  zIndex?: number
  onDismiss?: () => void
}) {
  const theme = useTheme()
  const fadeTransition = useTransition(isOpen, null, {
    config: { duration: 150 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })
  return (
    <>
      {fadeTransition.map(
        ({ item, key, props }) =>
          item && (
            <StyledDialogOverlay
              key={key}
              style={props}
              color={theme.bg1}
              unstable_lockFocusAcrossFrames={false}
              overflow="auto"
              alignitems="flex-start"
              zIndex={zIndex}
              onDismiss={onDismiss}
            >
              <StyledDialogContent aria-label="dialog content">{children}</StyledDialogContent>
            </StyledDialogOverlay>
          )
      )}
    </>
  )
}
