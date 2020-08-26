import dollyAxios from 'dolly-axios'
import { HOST, devMode } from './config'

interface Config {
  username: string;
  email: string;
  password: string;
  validateCode: string;
}

export function register(config: Config) {
  const basicUrl = '/api/register'

  const url = devMode
    ? basicUrl
    : HOST + basicUrl

  return dollyAxios.post(url, config).then(response => {
    if (response.data.code === 0) {
      return response.data.message
    } else {
      throw new Error(response.data.message)
    }
  })
}

export function verify(email: string) {
  const basicUrl = '/api/verify'

  const url = devMode
    ? basicUrl
    : HOST + basicUrl

  return dollyAxios.post(url, {
    email
  }).then(response => {
    console.log(response)
    if (response.data.code === 0) {
      return response.data.message
    }
  }).catch(error => {
    return error
  })
}
