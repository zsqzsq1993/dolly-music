import dollyAxios from 'dolly-axios'
import { HOST, devMode } from './config'
import {Song} from 'src/assets/ts/Song'

export function uploadFavorite(songs: Array<Song>): Promise<any> {
  const basicUrl = '/api/uploadFavorite'

  const url = devMode
    ? basicUrl
    : HOST + basicUrl

  return dollyAxios.post(url, {
    songs
  }).then(response => {
    return response.data
  })
}

export function downloadFavorite(username: string): Promise<any> {
  const basicUrl = '/api/downloadFavorite'

  const url = devMode
    ? basicUrl
    : HOST + basicUrl

  return dollyAxios.post(url, {
    username
  }).then(response => {
    return response.data
  })
}

export function searchUser(username: string): Promise<any> {
  const basicUrl = '/api/searchUser'

  const url = devMode
    ? basicUrl
    : HOST + basicUrl

  return dollyAxios.post(url, {
    username
  }).then(response => {
    return response.data
  })
}

export function addFriend(username: string): Promise<any> {
  const basicUrl = '/api/addFriend'

  const url = devMode
    ? basicUrl
    : HOST + basicUrl

  return dollyAxios.post(url, {
    username
  }).then(response => {
    return response.data
  })
}

export function removeFriend(username: string): Promise<any> {
  const basicUrl = '/api/removeFriend'

  const url = devMode
    ? basicUrl
    : HOST + basicUrl

  return dollyAxios.post(url, {
    username
  }).then(response => {
    return response.data
  })
}
