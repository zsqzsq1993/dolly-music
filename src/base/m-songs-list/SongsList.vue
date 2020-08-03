<template>
  <div class="m-songs-list">
    <ul>
      <li v-for="(song, index) in songs"
          :key="song.songid"
          class="song-wrapper"
          @click="selectItem(song, index)">
        <div class="song-content">
          <h2 class="song-title">{{song.songname}}</h2>
          <p class="song-desc">{{song.singer}}·{{song.albumname}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import {Prop, Component, Vue} from 'vue-property-decorator'
  import {Song} from 'src/assets/ts/Song'

  @Component
  export default class extends Vue {
    @Prop({
      default() {
        return []
      }
    }) readonly songs!: Array<undefined | Song>

    selectItem(song: Song, index: number) {
      this.$emit('select', song, index)
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'
  @import '~assets/stylus/mixin.styl'

  .m-songs-list
    .song-wrapper
      display flex
      align-items  center
      box-sizing border-box
      height 64px
      font-size $font-size-median
      .song-content
        flex 1
        line-height: 20px
        overflow: hidden
        .song-title
          color $color-text
          no-wrap()
        .song-desc
          margin-top 4px
          color $color-text-d
          no-wrap()
</style>
