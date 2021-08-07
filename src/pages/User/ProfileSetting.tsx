import React, { /*useState,*/ useCallback } from 'react'
import styled from 'styled-components'
import { ButtonBlack } from 'components/Button'
import { AutoColumn } from 'components/Column'
import Modal from 'components/Modal'
import TextInput from 'components/TextInput'
import AppBody from 'pages/AppBody'
import { CloseIcon, TYPE } from 'theme'
// import { AutoRow } from 'components/Row'
// import fallbackImg from 'assets/svg/fallback_image.svg'
import { useUserInfoUpdate } from 'hooks/useMyList'
import { UserInfo } from 'state/userInfo/actions'

// const Upload = styled.label`
//   & input {
//     display: none;
//   }
//   text-decoration: underline;
//   cursor: pointer;
// `

// const ImagePreview = styled.div`
//   background: linear-gradient(0deg, #ffffff, #ffffff);
//   border: 1px solid rgba(0, 0, 0, 0.1);
//   border-radius: 10px;
//   width: 100px;
//   height: 100px;
//   border-radius: 10px;;
//   overflow: hidden;
//   img {
//     width: 100%;
//     height:100%
//     object-fit: cover;
//   }
// `
const Close = styled(CloseIcon)`
  position: absolute;
  right: 29px;
  top: 29px;
  width: 32px;
  height: 32px;
`

export default function ProfileSetting({
  isOpen,
  onDismiss,
  userInfo
}: {
  isOpen: boolean
  onDismiss: () => void
  userInfo?: UserInfo
}) {
  // const [preview, setPreview] = useState<any>(fallbackImg)

  const { updateUserInfoCallback } = useUserInfoUpdate(userInfo)

  // const handleFile = useCallback(e => {
  //   const [file] = e.target.files
  //   if (file) {
  //     setPreview(URL.createObjectURL(file))
  //   }
  // }, [])

  const handleSubmit = useCallback(
    e => {
      e.preventDefault()
      if (!userInfo) return
      const object: { [key: string]: any } = { creater: userInfo?.account }
      const formData = new FormData(e.target)
      formData.forEach(function(value, key) {
        const keyString = key.toString()
        if (value) {
          object[keyString] = value
        } else {
          switch (keyString) {
            case 'description':
              object[keyString] = userInfo.bio
              break
            default:
              object[keyString] = userInfo[keyString as keyof typeof userInfo]
          }
        }
      })
      updateUserInfoCallback(object)
      onDismiss()
    },
    [onDismiss, updateUserInfoCallback, userInfo]
  )
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={600} zIndex={6}>
      <AppBody maxWidth="100%" style={{ position: 'relative', padding: 0, border: 'none', boxShadow: 'none' }}>
        <Close onClick={onDismiss} />
        <form onSubmit={handleSubmit} name="userInfo">
          <AutoColumn gap="40px" style={{ padding: '52px' }}>
            <TYPE.black fontSize={30} fontWeight={700}>
              User Profile
            </TYPE.black>

            <TextInput
              label="Username"
              placeholder={userInfo?.username ?? 'Please enter the username'}
              name="username"
              maxLength={20}
              hint="Maximum 20 characters"
            />
            <TextInput
              label="Bio"
              hint="Maximum 200 characters"
              placeholder={userInfo?.bio ?? 'Please introduce yourself'}
              name="description"
              maxLength={200}
              textarea
            />

            {/* <AutoRow gap="16px">
              <AutoColumn gap="8px">
                <TYPE.black>Profile Image</TYPE.black>
                <ImagePreview>
                  <img src={preview} alt="Profile preview" />
                </ImagePreview>
              </AutoColumn>
              <AutoColumn gap="8px">
                <Upload htmlFor="profile">
                  Upload Image
                  <input accept="image/*" type="file" name="profile" id="profile" onChange={handleFile} />
                </Upload>
                <TYPE.smallGray fontSize={14}>.jpg, .png, .jpeg formats</TYPE.smallGray>
              </AutoColumn>
            </AutoRow> */}
            <ButtonBlack type="submit">Save</ButtonBlack>
          </AutoColumn>
        </form>
      </AppBody>
    </Modal>
  )
}
