import { ButtonWhite } from 'components/Button'
import { Dots } from 'components/swap/styleds'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
const Frame = styled.div`
  width: 500px;
  height: 280px;
  /* border: 1px solid rgba(255, 255, 255, 0.2); */
  box-sizing: border-box;
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
`

const Title = styled.p`
  font-weight: 500;
  font-size: 24px;
  line-height: 88.69%;
  color: #ffffff;
`

export default function ComingSoon() {
  return (
    <Frame>
      <Title>
        Coming Soon <Dots />
      </Title>

      <div>This section is still implemeting. Please come back later</div>
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          marginTop: 45
        }}
      >
        <ButtonWhite width="240px" height={60}>
          Go to Spot Index
        </ButtonWhite>
      </Link>
    </Frame>
  )
}
