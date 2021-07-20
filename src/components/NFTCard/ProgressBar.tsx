import React from 'react'
import styled from 'styled-components'
import { CardColor } from '.'

export const StyledProgressBar = styled.div<{ leftPercentage: string; isLarge?: boolean; color: string }>`
  width: 100%;
  height: ${({ isLarge }) => (isLarge ? '14px' : '12px')};
  border-radius: 14px;
  background-color: rgba(0, 0, 0, 0.1); 
  position: relative;
  
  :before {
    position: absolute
    top:0;
    left: 0;
    content: '';
    height: 100%;
    border-radius: 14px;
    width: ${({ leftPercentage }) => leftPercentage};
    background-color: ${({ color }) => color};
  }
`

export default function ProgressBar({
  leftPercentage,
  color = CardColor.GREEN
}: {
  leftPercentage: string
  color?: string
}) {
  return <StyledProgressBar leftPercentage={leftPercentage} color={color} />
}
