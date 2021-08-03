import React from 'react'
import styled from 'styled-components'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { ArrowLeftCircle } from 'react-feather'

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
const StyledBackIcon = styled(CloseIcon)`
  right: auto;
  left: 0;
`

const CloseColor = styled(Close)<{ strokecolor?: string }>`
  path {
    stroke: ${({ theme, strokecolor }) => (strokecolor ? strokecolor : theme.text4)};
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
      <CloseColor strokecolor={strokeColor} />
    </CloseIcon>
  )
}

export function IconBack({ onEvent, style }: { onEvent: () => void; style?: any }) {
  return (
    <StyledBackIcon onClick={onEvent} style={style}>
      <ArrowLeftCircle />
    </StyledBackIcon>
  )
}
