import {getLyric, getSongUrl} from 'src/api/getSongs'
import {Base64} from 'js-base64'

export interface SongConfig {
  albumname: string;
  songname: string;
  singer: Array<{name: string}>;
  songmid: number;
  songid: number;
  url: string;
  albummid: string;
  belongCD: number;
  interval: number;
}
export class Song {
  albumname: string
  songname: string
  singer: string
  songmid: number
  songid: number
  url: string
  image: string
  interval: number
  lyric?: string

  constructor(config: SongConfig) {
    this.albumname = config.albumname
    this.songname = config.songname
    this.singer = stringfySinger(config.singer)
    this.songmid = config.songmid
    this.songid = config.songid
    this.interval = config.interval
    this.url = '' // placeholder
    this.image =
      `https://y.gtimg.cn/music/photo_new/T002R300x300M000${config.albummid}.jpg?max_age=2592000`
  }

  static getUrls(songs: Array<Song>): Promise<Array<Song>> {
    return getSongUrl(songs).then((map: any) => {
      return songs.filter(song => {
        song.url = map[song.songmid]
        return song.url
      })
    }).catch(e => {
      console.warn(e)
      return []
    })
  }

  getLyric(): Promise<string> {
    return new Promise((resolve, reject) => {
      getLyric(this).then((response: any) => {
        if (response.code === 0) {
          this.lyric = Base64.decode(response.lyric)
          resolve(this.lyric.slice())
        } else {
          reject(new Error('obtain lyric error.'))
        }
      })
    })
  }
}

export function createSong(config: SongConfig) {
  return new Song(config)
}

function stringfySinger(singer: Array<{name: string}>): string {
  if (!singer.length) {
    return ''
  }
  const ret: Array<string | undefined> = []
  singer.forEach(item => {
    ret.push(item.name)
  })
  return ret.join('/')
}

export function isValidSong(musicData: any) {
  return (
    musicData.songid &&
    musicData.albumid &&
    (!musicData.pay || !musicData.pay.payalbumprice)
  )
}
