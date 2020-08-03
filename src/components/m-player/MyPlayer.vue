<template>
    <div class="m-player" v-show="playList.length">
      <div class="normal-player" v-show="fullScreen">
        this is normal player
      </div>
      <div class="mini-player" v-show="!fullScreen">
        this is mini player
      </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import {Getter} from 'vuex-class'
    import {Song} from 'src/assets/ts/Song'

    @Component
    export default class extends Vue {
      @Getter('playList') playList!: Array<Song>
      @Getter('fullScreen') fullScreen!: boolean
    }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-player
    .normal-player
      position fixed
      z-index 150
      top 0
      right 0
      bottom 0
      left 0
      background $color-background
    .mini-player
      display flex
      position fixed
      z-index 180
      bottom 0
      height 60px
      width 100%
      background $color-highlight-background
</style>
