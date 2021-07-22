import React from 'react'
import styled from 'styled-components'
import { ReactComponent as Close } from '../../assets/images/x.svg'

const CloseIcon = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)<{ strokeColor?: string }>`
  path {
    stroke: ${({ theme, strokeColor }) => (strokeColor ? strokeColor : theme.text4)};
  }
`

export default function IconClose({
  onEvent,
  strokeColor,
  style
}: {
  strokeColor?: string
  onEvent: () => void
  style: any
}) {
  return (
    <CloseIcon onClick={onEvent} style={style}>
      <CloseColor strokeColor={strokeColor} />
    </CloseIcon>
  )
}
