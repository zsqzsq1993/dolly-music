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

  constructor(config: SongConfig) {
    this.albumname = config.albumname
    this.songname = config.songname
    this.singer = stringfySinger(config.singer)
    this.songmid = config.songmid
    this.songid = config.songid
    this.interval = config.interval
    this.url = '' // placeholder
    this.image =
      `https://y.gtimg.cn/music/photo_new/T002R300x300M000${config.albummid}_${config.belongCD}.jpg`
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