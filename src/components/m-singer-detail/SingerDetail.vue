<template>
  <slide-transition> // 初次渲染，想要有transition效果，要加appear
    <music-list
      :title="singer.name"
      :avatar="singer.avatar"
      :songs="songs">
    </music-list>
  </slide-transition>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import {getSingerDetail} from 'src/api/getSingers'
  import {Song, createSong, SongConfig, isValidSong} from 'src/assets/ts/Song'
  import {getSongUrl} from 'src/api/getSongs'
  import MusicList from 'components/m-music-list/MusicList.vue'
  import {Singer} from 'src/assets/ts/Singer'
  import SlideTransition from 'base/m-transition/SlideTransition.vue'

  @Component({
    components: {
      MusicList,
      SlideTransition
    }
  })
  export default class extends Vue {
    @Getter('singer') singer!: Singer

    songs: Array<Song | undefined> = []

    created() {
      this._getSingerDetail(this.singer.id)
    }

    _getSingerDetail(id: string) {
      if (!id) {
        this.$router.push({
          path: '/singers'
        })
        return
      }

      getSingerDetail(id).then(response => {
        return this._genSongs(response)
      }).then((songs: Array<Song>) => {
        return this._getSongUrl(songs)
      }).then((songs: Array<Song>) => {
        this.songs = songs
      }).catch(e => {
        console.log(e)
      })
    }

    _genSongs(response: any): Array<Song> {
      if (response.code === 0) {
        const dataList: Array<any> = response.data && response.data.list
        const songs: Array<Song> = []
        dataList.forEach(data => {
          if (data.musicData && isValidSong(data.musicData)) {
            songs.push(createSong(data.musicData as SongConfig))
          }
        })
        return songs
      } else {
        throw new Error('can not get songList')
      }
    }

    _getSongUrl(songs: Array<Song>): Promise<Array<Song>> {
      return getSongUrl(songs).then((purlMap: any) => {
        return songs.filter(song => {
          song.url = purlMap[song.songmid]
          return song.url
        })
      })
    }
  }
</script>
