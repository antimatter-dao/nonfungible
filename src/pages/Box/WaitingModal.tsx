import React from 'react'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import { ButtonBlack } from 'components/Button'
import { RowBetween } from 'components/Row'
import Spinner from 'components/Spinner'

export default function WaitingModal({
  title,
  buttonText,
  icon,
  onClick,
  subTitle
}: {
  title: string
  buttonText: string | React.ReactNode
  icon?: React.ReactNode
  onClick?: () => void
  subTitle?: string
}) {
  return (
    <AutoColumn gap="72px" justify="flex-start">
      <div>
        <RowBetween style={{ marginBottom: 8 }}>
          <TYPE.black fontWeight={700} fontSize={30} className="title">
            {title}
          </TYPE.black>
        </RowBetween>
        {subTitle && <TYPE.smallGray style={{ marginTop: 8 }}>{subTitle}</TYPE.smallGray>}
      </div>
      <RowBetween style={{ marginBottom: 8 }}>
        <div />
        {icon || <Spinner size="64px" />}
        <div />
      </RowBetween>

      <ButtonBlack disabled={!onClick} onClick={onClick}>
        {buttonText}
      </ButtonBlack>
    </AutoColumn>
  )
}
