import { getCurrentUserInfoSync } from 'state/userinfo/hooks'

const domain = 'http://47.241.14.27:8081'
const headers = { 'content-type': 'application/json', accept: 'application/json' }

interface LoginRes {
  token: string
  username: string | null
  description: string | null
  id?: string
}

export function appLogin(publicAddress: string, signature: string, message: string): Promise<LoginRes> {
  const param = {
    publicAddress,
    signature,
    message
  }

  // After the wallet is connected, it will be available after the effect is maintained.
  const userinfo = getCurrentUserInfoSync()
  let _headers = headers
  if (userinfo) {
    _headers = Object.assign(headers, { token: userinfo.token })
  }

  const request = new Request(`${domain}/app/login`, {
    method: 'POST',
    body: JSON.stringify(param),
    headers: _headers
  })

  return new Promise((resolve, reject) => {
    fetch(request)
      .then(response => {
        if (response.status !== 200) {
          reject('server error')
        }
        return response.json()
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function positionFetch(token: string | undefined) {
  if (!token) {
    return
  }

  const request = new Request(`${domain}/app/getPositionList`, {
    method: 'POST',
    headers: { ...headers, token }
  })

  return new Promise((resolve, reject) => {
    fetch(request)
      .then(response => {
        if (response.status !== 200) {
          reject('server error')
        }
        return response.json()
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function allNFTFetch(): Promise<any> {
  const request = new Request(`${domain}/app/getNftList`, {
    method: 'POST',
    headers: headers
  })

  return new Promise((resolve, reject) => {
    fetch(request)
      .then(response => {
        if (response.status !== 200) {
          reject('server error')
        }
        return response.json()
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
