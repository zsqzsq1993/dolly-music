import {Singer} from 'src/assets/ts/Singer'
import {createSong, isValidSong, Song, SongConfig} from 'src/assets/ts/Song'
import {getSearch} from 'src/api/getSearch'

const DEFAULT_CURNUM = 20

interface SearcherConfig {
  keyword: string;
  curnum?: number;
  singerInfo?: boolean;
}

export default class Searcher {
  // 请求的关键字
  keyword: string;

  // 一次实际请求返回的歌曲数, 但不一定每个url都有效
  curnum: number;

  // 当前请求的页数
  curpage: number;

  // 总共的歌曲数
  totalnum: number;

  // 歌手信息
  singer: Singer | null;

  // 总搜索结果
  results: Array<Song>;

  // 单次搜索结果，注意单次搜索结果并不一定等于一次请求结果的数量
  // 因为一次请求，有些播放地址请求不到，需要再次请求以补气curnum
  currentResult: Array<Song>;

  // 是否请求歌手信息
  singerInfo: boolean;

  // 标志位，是否还能请求更多信息
  hasMore: boolean;

  // 是否正在加载的标志位
  loading: boolean;

  constructor(config: SearcherConfig) {
    this.keyword = config.keyword
    this.curnum = config.curnum || DEFAULT_CURNUM
    this.singerInfo = config.singerInfo || true
    this.hasMore = true
    this.curpage = 1
    this.totalnum = 0
    this.loading = false

    this.singer = null
    this.results = []
    this.currentResult = []
  }

  search(): Promise<any> {
    return getSearch(this.keyword, this.curpage, this.singerInfo, this.curnum).then((response: any) => {
      if (response.code === 0) {
        response = response.data
        this.hasMore = this.checkMore()

        if (this.curpage === 1) {
          this.singer = this.singerInfo
            ? new Singer(response.zhida.singerid, response.zhida.singername)
            : null
          this.totalnum = response.song.totalnum
        }

        const songs: Array<Song> = []
        response.song.list.forEach((item: any) => {
          if (isValidSong(item)) {
            songs.push(createSong(item as SongConfig))
          }
        })

        Song.getUrls(songs).then((songs: Array<Song>) => {
          if (songs.length >= this.curnum) {
            return this.concatResults()
          } else {
            return this.searchMore()
          }
        })
      } else {
        throw new Error(`can not get search results by keyword ${this.keyword}`)
      }
    })
  }

  searchMore() {
    this.loading = true
    if (this.hasMore) {
      this.curpage++
      this.search().then(() => {
        this.loading = false
      })
    }
  }

  checkMore() {
    return (this.curpage + 1) * this.curnum < this.totalnum
  }

  concatResults() {
    this.results = Array.prototype.concat(this.results, this.currentResult)
    this.currentResult = []
  }

}
