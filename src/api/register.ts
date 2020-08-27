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
    return response.data
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
    return response.data
  }).catch(error => {
    return error
  })
}
