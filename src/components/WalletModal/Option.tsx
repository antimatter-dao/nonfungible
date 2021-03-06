import React from 'react'
import styled from 'styled-components'
import { ExternalLink } from '../../theme'
import Chevron from 'assets/svg/chevron_right.svg'

const InfoCard = styled.button<{ active?: boolean }>`
  background-color: transparent;
  padding: 1rem;
  outline: none;
  border: 1px solid;
  border-radius: 49px;
  width: 100% !important;
  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.text3};
  }
  border-color: ${({ theme, active }) => (active ? theme.text3 : theme.text2)};
`

const OptionCard = styled(InfoCard as any)`
  display: flex;
  z-index: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 2rem;
  padding: 18px 30px;
  position: relative;
  background-color: #ffffff;
  :after {
    content: '';
    width: 8px;
    height: 16px;
    background: url(${Chevron}) 100% 100% no-repeat;
    right: 30px
    position:absolute;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    background-color: transparent;
    justify-content: center;
  `}
`

const OptionCardLeft = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  justify-content: center;
  height: 100%;
`

const OptionCardClickable = styled(OptionCard as any)<{ clickable?: boolean }>`
  margin-top: 0;
  &:hover {
    cursor: ${({ clickable }) => (clickable ? 'pointer' : '')};
    border: 1px solid ${({ clickable, theme }) => (clickable ? theme.text3 : theme.text3)};
  }
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
`

const GreenCircle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: center;
  align-items: center;

  &:first-child {
    height: 8px;
    width: 8px;
    margin-right: 8px;
    background-color: ${({ theme }) => theme.primary1};
    border-radius: 50%;
  }
`

const CircleWrapper = styled.div`
  color: ${({ theme }) => theme.text3};
  display: flex;
  justify-content: center;
  align-items: center;
`

const HeaderText = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  color: ${({ theme }) => theme.bg1};
  font-size: 1rem;
  font-weight: 500;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    color: ${({ theme }) => theme.text1};
`}
`

const SubHeader = styled.div`
  color: ${({ theme }) => theme.text1};
  margin-top: 10px;
  font-size: 12px;
`

const IconWrapper = styled.div<{ size?: number | null }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: auto;
    width: ${({ size }) => (size ? size + 'px' : '24px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
  margin-right: 20px;
`

export default function Option({
  link = null,
  clickable = true,
  size,
  onClick = null,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  id
}: {
  link?: string | null
  clickable?: boolean
  size?: number | null
  onClick?: null | (() => void)
  color: string
  header: React.ReactNode
  subheader: React.ReactNode | null
  icon: string
  active?: boolean
  id: string
}) {
  const content = (
    <OptionCardClickable id={id} onClick={onClick} clickable={clickable && !active} active={active}>
      <IconWrapper size={size}>
        <img src={icon} alt={'Icon'} />
      </IconWrapper>
      <OptionCardLeft>
        <HeaderText color={color}>
          {active ? (
            <CircleWrapper>
              <GreenCircle>
                <div />
              </GreenCircle>
            </CircleWrapper>
          ) : (
            ''
          )}
          {header}
        </HeaderText>
        {subheader && <SubHeader>{subheader}</SubHeader>}
      </OptionCardLeft>
    </OptionCardClickable>
  )
  if (link) {
    return <ExternalLink href={link}>{content}</ExternalLink>
  }

  return content
}
