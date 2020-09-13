export const devMode: boolean = process.env.NODE_ENV !== 'production'

export interface RetData<T> {
  code: number;
  data: Array<T>;
}

export const commonData = {
  g_tk: 1928093487,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp',
  platform: 'yqq.json'
}

export const jsonpOptions = {
  param: 'jsonpCallback',
  prefix: 'jp'
}

export const recommandCarouselData = {
  hostUin: 0,
  needNewCode: 0,
  inCharset: 'utf8',
  format: 'json',
  '-': 'recom' + (Math.random() + '').replace('0.', ''),
  data: {
    'comm': {'ct': 24},
    'category': {'method': 'get_hot_category', 'param': {'qq': ''}, 'module': 'music.web_category_svr'},
    'recomPlaylist': {
      'method': 'get_hot_recommend',
      'param': {'async': 1, 'cmd': 2},
      'module': 'playlist.HotRecommendServer'
    },
    'playlist': {
      'method': 'get_playlist_by_category',
      'param': {'id': 8, 'curPage': 1, 'size': 40, 'order': 5, 'titleid': 8},
      'module': 'playlist.PlayListPlazaServer'
    },
    'new_song': {'module': 'newsong.NewSongServer', 'method': 'get_new_song_info', 'param': {'type': 5}},
    'new_album': {
      'module': 'newalbum.NewAlbumServer',
      'method': 'get_new_album_info',
      'param': {'area': 1, 'sin': 0, 'num': 10}
    },
    'new_album_tag': {'module': 'newalbum.NewAlbumServer', 'method': 'get_new_album_area', 'param': {}},
    'toplist': {'module': 'musicToplist.ToplistInfoServer', 'method': 'GetAll', 'param': {}},
    'focus': {'module': 'QQMusic.MusichallServer', 'method': 'GetFocus', 'param': {}}
  }
}

export const recommandListData = {
  picmid: 1,
  rnd: Math.random(),
  g_tk_new_20200303: 5381,
  loginUin: 0,
  hostUin: 0,
  format: 'json',
  inCharset: 'utf8',
  needNewCode: 0,
  categoryId: 10000000,
  sortId: 5,
  sin: 0,
  ein: 19
}

export const singerListData = {
  // '-': 'getUCGI'+(Math.random()+'').replace('0.','')
  channel: 'singer',
  page: 'list',
  key: 'all_all_all',
  pagesize: 100,
  pagenum: 1,
  hostUin: 0,
  needNewCode: 0,
  platform: 'yqq'
}

export const singerDetailData = {
  hostUin: 0,
  needNewCode: 0,
  platform: 'yqq',
  order: 'listen',
  begin: 0,
  num: 80,
  songstatus: 1
}

export const songUrlData = {
  g_tk: 5381,
  format: 'json',
  platform: 'h5',
  needNewCode: 1,
  uin: 0
}

export const songLyricData = {
  pcachetime: +new Date(),
  hostUin: 0,
  format: 'json',
  inCharset: 'utf8',
  needNewCode: 0,
  categoryId: 10000000
}

export const recommandDetailData = {
  type: 1,
  json: 1,
  utf8: 1,
  onlysong: 0,
  // new_format: 1, // 这会传回new format的数据，在构建Song实例时更加麻烦
  // g_tk_new_20200303: 5381,
  // g_tk: 5381,
  loginUin: 0,
  hostUin: 0,
  format: 'json',
  inCharset: 'utf8',
  needNewCode: 0
}

// cause socket hang up error
// export const topListData = {
//   '_': +new Date(),
//   data: {
//     comm: {
//       g_tk: 5381,
//       uin: '',
//       format: 'json',
//       inCharset: 'utf-8',
//       outCharset: 'utf-8',
//       notice: 0,
//       platform: 'h5',
//       needNewCode: 1,
//       ct: 23,
//       cv: 0
//     },
//     topList: {
//       module: 'musicToplist.ToplistInfoServer',
//       method: 'GetAll',
//       param: {}
//     }
//   }
// }

export const topListData = {
  uin: 0,
  needNewCode: 1,
  platform: 'h5'
}

export const topListDetailData = {
  needNewCode: 1,
  uin: 0,
  tpl: 3,
  page: 'detail',
  type: 'top',
  platform: 'h5'
}

export const hotSearchData = {
  g_tk_new_20200303: 5381,
  g_tk: 5381,
  loginUin: 0,
  hostUin: 0,
  format: 'json',
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  platform: 'yqq.json',
  needNewCode: 0
}

export const getSearchData = {
  g_tk: 5381,
  uin: '',
  format: 'json',
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  platform: 'h5',
  needNewCode: 1,
  zhidaqu: 1,
  t: 0,
  flag: 1,
  ie: 'utf-8',
  sem: 1,
  aggr: 0,
  remoteplace: 'txt.mqq.all'
}

export const HOST = 'http://dollylosingweight.today/music'
