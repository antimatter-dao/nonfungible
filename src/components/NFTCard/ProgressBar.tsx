import React from 'react'
import styled from 'styled-components'

export const StyledProgressBar = styled.div<{ leftPercentage: string; isLarge?: boolean; color: string }>`
  width: 100%;
  height: ${({ isLarge }) => (isLarge ? '12px' : '8px')};
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
  voteFor,
  voteAgainst,
  color
}: {
  voteFor: number
  voteAgainst: number
  color: string
}) {
  return <StyledProgressBar leftPercentage={`${(voteFor * 100) / (voteFor + voteAgainst)}%`} color={color} />
}
