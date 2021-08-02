import { getCurrentUserInfoSync } from 'state/userinfo/hooks'

const domain = 'http://47.241.14.27:8081'
const headers = { 'content-type': 'application/json', accept: 'application/json' }

export function appLogin(publicAddress: string, signature: string, message: string) {
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
        resolve(response.msg)
      })
      .catch(error => {
        reject(error)
      })
  })
}
