import dollyAxios from 'dolly-axios'
import { HOST, devMode } from './config'

interface RegisterConfig {
  username: string;
  email: string;
  password: string;
  validateCode: string;
}

export function register(config: RegisterConfig) {
  const basicUrl = '/api/register'

  const url = devMode
    ? basicUrl
    : HOST + basicUrl

  return dollyAxios.post(url, config).then(response => {
    return response.data
  })
}
