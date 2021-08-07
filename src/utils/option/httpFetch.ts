import { getCurrentUserInfoSync, clearLoginStoreSync } from 'state/userInfo/hooks'

const domain = 'https://nftapi.antimatter.finance'
const headers = { 'content-type': 'application/json', accept: 'application/json' }

interface LoginRes {
  token: string
  username: string | null
  description: string | null
  id?: string
}
export interface SportIndexSearchProps {
  searchParam: string
  searchBy: string
}

export interface UserInfoQuery {
  createTime?: string
  creater?: string
  description?: string
  id?: string | number
  remark?: string
  updateTime?: string
  username?: string
}

const promiseGenerator = (request: Request) => {
  return new Promise((resolve, reject) => {
    fetch(request)
      .then(response => {
        if (response.status !== 200) {
          reject('server error')
        }
        return response.json()
      })
      .then(response => {
        if (response.code === 401) {
          clearLoginStoreSync()
          reject('Unauthorized')
        }
        if (response.code === 403 || response.code === 404) {
          reject('error')
        }
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function appLogin(publicAddress: string, signature: string, message: string): Promise<LoginRes> {
  const param = {
    publicAddress,
    signature,
    message
  }

  // After the wallet is connected, it will be available after the effect is maintained.
  const userInfo = getCurrentUserInfoSync()
  let _headers = headers
  if (userInfo) {
    _headers = Object.assign(headers, { token: userInfo.token })
  }

  const request = new Request(`${domain}/app/login`, {
    method: 'POST',
    body: JSON.stringify(param),
    headers: _headers
  })

  return promiseGenerator(request) as Promise<LoginRes>
}

export function getAccountInfo(address: string): Promise<LoginRes> {
  const request = new Request(`${domain}/app/getAccountInfo`, {
    method: 'POST',
    body: address,
    headers: headers
  })

  return promiseGenerator(request) as Promise<LoginRes>
}

export function positionListFetch(
  token: string | undefined,
  address: string | undefined,
  currentPage: number,
  pageSize: number
) {
  if (!token || !address) {
    return
  }
  const request = new Request(`${domain}/app/getPositionList`, {
    method: 'POST',
    headers: { ...headers, token },
    body: JSON.stringify({ address, curPage: currentPage, pageSize })
  })

  return promiseGenerator(request)
}

export function indexListFetch(
  token: string | undefined,
  address: string | undefined,
  currentPage: number,
  pageSize: number
) {
  if (!token || !address) {
    return
  }

  const request = new Request(`${domain}/app/getIndexList`, {
    method: 'POST',
    headers: { ...headers, token },
    body: JSON.stringify({ address, curPage: currentPage, pageSize })
  })

  return promiseGenerator(request)
}

export function allNFTFetch(curPage: number, { searchBy, searchParam }: SportIndexSearchProps): Promise<any> {
  const param = {
    indexName: searchParam === 'indexName' ? searchBy : '',
    nftId: searchParam === 'indexId' ? searchBy : '',
    curPage,
    pageSize: '8'
  }
  const request = new Request(`${domain}/app/getNftList`, {
    method: 'POST',
    body: JSON.stringify(param),
    headers: headers
  })

  return promiseGenerator(request)
}

export function userInfoFetch(token: string | undefined, params: UserInfoQuery) {
  if (!token) {
    return
  }
  const request = new Request(`${domain}/app/createAccount`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { ...headers, token }
  })
  return promiseGenerator(request)
}

export function getNFTTransferRecords(nftId: string): Promise<any> {
  const param = {
    indexName: '',
    address: '',
    nftId
  }
  const request = new Request(`${domain}/app/transferRecord`, {
    method: 'POST',
    body: JSON.stringify(param),
    headers: headers
  })
  return promiseGenerator(request)
}
