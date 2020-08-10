<template>
  <slide-transition>
    <music-list
      :title="diss.dissname"
      :avatar="diss.imgurl"
      :songs="songs"></music-list>
  </slide-transition>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import MusicList from 'src/components/m-music-list/MusicList.vue'
  import SlideTransition from 'base/m-transition/SlideTransition.vue'
  import {getRecommandDetail} from 'src/api/getRecommand'
  import {Song, createSong, SongConfig, isValidSong} from 'src/assets/ts/Song'
  import {getSongUrl} from 'src/api/getSongs'

  @Component({
    components: {
      MusicList,
      SlideTransition
    }
  })
  export default class extends Vue {
    @Getter('diss') readonly diss!: any

    songs: Array<Song> = []

    created() {
      this._getRecommandDetail()
    }

    _getRecommandDetail() {
      if (!this.diss.dissid) {
        this.$router.push('/recommand')
        return
      }

      getRecommandDetail(this.diss.dissid).then(response => {
        return this._getSongs(response)
      }).then(songs => {
        return this._getSongUrl(songs)
      }).then(songs => {
        this.songs = songs
      }).catch(e => {
        console.log(e)
      })
    }

    _getSongs(response: any): Array<Song> {
      if (response.code === 0) {
        const songs: Array<Song> = []
        const songList = response.cdlist[0].songlist
        songList.forEach((item: any) => {
          if (isValidSong(item)) {
            songs.push(createSong(item as SongConfig))
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
