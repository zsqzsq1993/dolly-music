<template>
  <slide-transition>
    <music-list :title="title"
                :avatar="avatar"
                :songs="songs"
                :rank="true"></music-list>
  </slide-transition>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import SlideTransition from 'base/m-transition/SlideTransition.vue'
  import MusicList from 'components/m-music-list/MusicList.vue'
  import {getTopListDetail} from 'src/api/getRank'
  import {createSong, isValidSong, Song, SongConfig} from 'src/assets/ts/Song'

  @Component({
    components: {
      SlideTransition,
      MusicList
    }
  })
  export default class extends Vue {
    songs: Array<Song> = []

    @Getter('toplist') readonly topList!: any

    created() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }

      this.getSongs().then((songs: Array<Song>) => {
        return this.getSongsUrl(songs)
      }).then((songs: Array<Song>) => {
        this.songs = songs
      })
    }

    get title() {
      return this.topList.topTitle
    }

    get avatar() {
      if (this.songs.length) {
        return this.songs[0].image
      }
    }

    getSongs(): Promise<Array<Song>> {
      return getTopListDetail(this.topList.id).then(response => {
        if (response.code === 0) {
          const songs: Array<Song> = []
          response = response.songlist
          response.forEach((item: any) => {
            if (isValidSong(item.data)) {
              songs.push(createSong(
                item.data as SongConfig
              ))
            }
          })
          return songs
        } else {
          throw new Error('can not get toplist detail songs.')
        }
      })
    }

    getSongsUrl(songs: Array<Song>): Promise<Array<Song>> {
      return Song.getUrls(songs)
    }
  }
</script>

<style lang="stylus"></style>
