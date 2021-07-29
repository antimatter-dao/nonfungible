import { fetchInterceptor } from './httpFetch'

window.fetch = (fetch => {
  return (input: RequestInfo, init?: RequestInit | undefined) => {
    return fetchInterceptor.interceptor(fetch, { input, init })
  }
})(window.fetch)

// const domain = 'https://testapi.antimatter.finance'

fetchInterceptor.interceptors.push(
  {
    request: (input: string, init: RequestInit) => {
      const headers = new Headers(init.headers)
      headers.append('content-type', 'application/json')
      headers.append('accept', 'application/json')
      init.headers = headers
      return { input, init }
    }
  },
  {
    response: (response: Response) => {
      if (response.status === 401) {
        console.log('no login')
      }
      return response
    }
  }
)
