<template>
  <div class="m-songs-list">
    <ul>
      <li v-for="song in songs"
          :key="song.songid"
          class="song-wrapper">
        <h2 class="song-title">{{song.songname}}</h2>
        <p class="song-desc">{{song.singer}}·{{song.albumname}}</p>
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
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'
  @import '~assets/stylus/mixin.styl'

  .m-songs-list
    .song-wrapper
      display flex
      flex-direction column
      justify-content center
      height 64px
      line-height 20px
      font-size $font-size-median
      .song-title
        color $color-text
        no-wrap()
      .song-desc
        margin-top 4px
        color $color-text-d
        no-wrap()

</style>
