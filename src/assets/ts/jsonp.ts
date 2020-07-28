import originJsonp from 'jsonp'

export function concatParams(url: string, data?: any) {
  if (!data) {
    return url
  }
  const params = []
  for (const key in data) {
    const val = data[key]
    params.push(`${key.trim()}=${encodeURIComponent(val)}`)
  }

  url += (url.indexOf('?') < 0 ? '?' : '&')
  return url + params.join('&')
}

export function jsonp(url: string, data: any, options: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const concatUrl = concatParams(url, data)
    // console.log(concatUrl)
    originJsonp(concatUrl, options, (err: any, data: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
