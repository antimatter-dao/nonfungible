import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { saturate, darken, opacify, adjustHue, transparentize } from 'polished'
import { CardColor } from '.'
import { Timer } from 'components/Timer'
import useTheme from 'hooks/useTheme'
import { TYPE } from 'theme/'

type WhenTimerEndInSeconds = number

export const StyledCapsule = styled.div<{ color: string; padding?: string }>`
  padding: ${({ padding }) => padding ?? '6px 10px'}
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  width: max-content;
  display: flex;
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 0.2;
    background-color: ${({ color }) => color};
  }
`

export function Capsule({ color, children }: { color: CardColor; children: React.ReactNode }) {
  const theme = useTheme()
  return <StyledCapsule color={theme[color]}>{children}</StyledCapsule>
}

export function TimerCapsule({
  color = CardColor.GREEN,
  timeLeft
}: {
  color?: CardColor
  timeLeft: WhenTimerEndInSeconds
}) {
  const [isClosed, setIsClosed] = useState(!timeLeft)

  const theme = useTheme()

  const saturatedColor = useMemo(() => adjustHue(10, opacify(1, saturate(0.9, darken(0.3, theme[color])))), [
    color,
    theme
  ])

  const handleOnZero = useCallback(() => {
    setIsClosed(true)
  }, [])

  return (
    <StyledCapsule color={isClosed ? transparentize(0.3, theme.red1) : theme[color]} padding="7px 14px">
      <TYPE.small color={isClosed ? theme.red1 : saturatedColor} width="90px" textAlign="center">
        {isClosed ? 'Closed' : <Timer timer={timeLeft} onZero={handleOnZero} />}
      </TYPE.small>
    </StyledCapsule>
  )
}
