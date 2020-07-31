<template>
  <div class="m-music-list">
    <div class="back-icon-wrapper"
         @click.stop.prevent="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="avatar"
         :style="bgImage"
         ref="avatar">
    </div>
    <div class="filter"></div>
    <div class="scroll-wrapper" ref="scrollWrapper">
      <scroll :data="songs">
        <songs-list :songs="songs"></songs-list>
        <loading :show="!songs.length" class="loading"></loading>
      </scroll>
    </div>
  </div>
</template>

<script lang="ts">
  import {Prop, Component, Vue} from 'vue-property-decorator'
  import SongsList from 'base/m-songs-list/SongsList.vue'
  import Scroll from 'base/m-scroll/Scroll.vue'
  import Loading from 'base/m-loading/Loading.vue'
  import {Song} from 'src/assets/ts/Song'

  @Component({
    components: {
      SongsList,
      Scroll,
      Loading
    }
  })
  export default class extends Vue {
    @Prop({default: ''}) readonly title!: string
    @Prop({default: ''}) readonly avatar!: string
    @Prop({
      default() {
        return []
      }
    }) readonly songs!: Array<undefined | Song>

    get bgImage() {
      return `background-image: url(${this.avatar})` // do not use background
    }

    mounted() {
      (this.$refs.scrollWrapper as any).style.top =
        (this.$refs.avatar as HTMLElement).clientHeight + 'px'
    }

    goBack() {
      this.$router.back()
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-music-list
    position fixed
    z-index 100
    top 0
    right 0
    bottom 0
    left 0
    background $color-background

    .back-icon-wrapper
      position absolute
      z-index 50
      top 0
      left 6px

      .icon-back
        display inline-block
        padding 6px
        font-size $font-size-large-x
        color $color-theme

    .title
      position absolute
      z-index 40
      width 100%
      top 0
      left 0
      text-align center
      line-height 40px
      font-size $font-size-large
      color $color-text

    .avatar
      width 100%
      height 0
      padding-top 70%
      background-size cover

    .filter
      position absolute
      top 0
      left 0
      z-index 30
      width 100%
      padding-top 70%
      background rgba(7, 17, 27, 0.4)

    .scroll-wrapper
      position absolute
      top 0
      bottom 0
      width 100%
      overflow hidden

      .loading
        position absolute
        top 50%
        transform translateY(-50%)
</style>
