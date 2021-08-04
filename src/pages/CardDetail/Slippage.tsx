import React from 'react'
import Popover from '@material-ui/core/Popover'
import { Settings } from 'react-feather'
import styled from 'styled-components'

const StyledSetting = styled.div``

export default function SimplePopover() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div>
      <StyledSetting aria-describedby={id} color="primary" onClick={handleClick}>
        <Settings />
      </StyledSetting>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <input />
      </Popover>
    </div>
  )
}
