<template>
  <transition name="slide">
    <music-list
      :title="singer.name"
      :avatar="singer.avatar"
      :songs="songs">
    </music-list>
  </transition>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import {getSingerDetail} from 'src/api/getSingers'
  import {Song, createSong, SongConfig, isValidSong} from 'src/assets/ts/Song'
  import {getSongUrl} from 'src/api/getSongs'
  import MusicList from 'components/m-music-list/MusicList.vue'

  @Component({
    components: {
      MusicList
    }
  })
  export default class extends Vue {
    @Getter('singer') singer: any

    songs: Array<Song | undefined> = []

    created() {
      this._getSingerDetail(this.singer.id)
    }

    _getSingerDetail(id: string) {
      if (!id) {
        this.$router.push({path: '/singers'})
        return
      }

      getSingerDetail(id).then(response => {
        return this._genSongs(response)
      }).then((songs: Array<Song>) => {
        return this._getSongUrl(songs)
      }).then((songs: Array<Song>) => {
        this.songs = songs
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
        throw Error('can not get singer detail.')
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

<style lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition all .3s

  .slide-enter, .slide-leave-to
    transform translate3d(-100%, 0, 0)
</style>
