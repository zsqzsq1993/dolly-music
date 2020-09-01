<template>
  <slide-transition>
    <music-list
      :title="friendUsername"
      :avatar="getAvatar"
      :songs="songs" v-if="songs.length">
    </music-list>
  </slide-transition>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import {downloadFavorite} from 'src/api/favorite'
  import SlideTransition from 'base/m-transition/SlideTransition.vue'
  import MusicList from 'components/m-music-list/MusicList.vue'
  import {Song} from 'src/assets/ts/Song'

  @Component({
    components: {
      SlideTransition,
      MusicList
    }
  })
  export default class extends Vue {
    @Getter('friendUsername') readonly friendUsername!: string

    songs: Array<Song> = []

    get getAvatar() {
      return this.songs.length
        ? this.songs[0].image
        : ''
    }

    created() {
      this.getSongs()
    }

    getSongs() {
      if (this.friendUsername) {
        downloadFavorite(this.friendUsername).then(response => {
          if (response.code === 0) {
            this.songs = response.data
          }
          this.handleEmptySongs(this.songs)
        })
      } else {
        this.$router.push('/user')
      }
    }

    handleEmptySongs(songs: Array<Song>) {
      if (!songs.length) {
        this.$emit('no-songs')
        this.$router.back()
      }
    }
  }
</script>

<style lang="stylus"></style>
