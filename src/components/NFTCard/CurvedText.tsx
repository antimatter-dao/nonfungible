import React from 'react'
import useTheme from 'hooks/useTheme'

export default function CurvedText({ text, inverted }: { text: string; inverted?: boolean }) {
  const theme = useTheme()
  return (
    <svg
      width="151"
      height="70"
      viewBox="0 0 151 70"
      style={
        inverted
          ? { position: 'absolute', left: 0, bottom: 4, transform: 'rotate(180deg)', zIndex: 2 }
          : { position: 'absolute', right: 0, top: 4, zIndex: 2 }
      }
    >
      <path id="curve" opacity="1" d="M0 9 h123 c0 0 12.5 5 16 16v40" stroke="none" fill="transparent" />
      <text width="151">
        <textPath xlinkHref="#curve" fontSize={12} alignmentBaseline="middle" fill={theme.text3}>
          {text}
        </textPath>
      </text>
    </svg>
  )
}
