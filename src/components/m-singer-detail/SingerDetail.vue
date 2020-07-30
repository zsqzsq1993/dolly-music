<template>
  <div class="m-singer-detail">
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import {getSingerDetail} from 'src/api/getSingers'
  import {Song, createSong, SongConfig, isValidSong} from 'src/assets/ts/Song'
  import {getSongUrl} from 'src/api/getSongs'

  @Component
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
        console.log(this.songs) // tempt
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
  @import '~assets/stylus/variable.styl'

  .m-singer-detail
    position fixed
    z-index 100
    top 0
    right 0
    bottom 0
    left 0
    background $color-background
</style>
