<template>
  <div class="m-music-list">
    <div class="back-icon-wrapper"
         @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="avatar"
         :style="bgImage"
         ref="avatar">
      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :data="songs"
      :click="true"
      :listen-scroll="true"
      :probType="3"
      @onscroll="handleScroll"
      class="songs-scroll"
      ref="scroll">
      <div class="songs-list-wrapper">
        <songs-list :songs="songs"></songs-list>
      </div>
      <loading :show="!songs.length" class="loading"></loading>
    </scroll>
  </div>
</template>

<script lang="ts">
  import {Prop, Component, Vue} from 'vue-property-decorator'
  import SongsList from 'base/m-songs-list/SongsList.vue'
  import Scroll from 'base/m-scroll/Scroll.vue'
  import Loading from 'base/m-loading/Loading.vue'
  import {Song} from 'src/assets/ts/Song'
  import {prefixStyle} from 'src/assets/ts/dom'

  const RESERVED_HEIGHT = 40
  const ZINDEX = '10'
  const transform = prefixStyle('transform') || 'transform'

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

    imgHeight = 0
    scrollState = -1

    get bgImage() {
      return `background-image: url(${this.avatar})` // do not use background
    }

    mounted() {
      this._initScrollTop()
      this._initHandleNegativeScroll()
      this._initHandlePositiveScroll()
    }

    goBack() {
      this.$router.back()
    }

    handleScroll(pos: { x: number; y: number }): void {
      const scrollY = pos.y
      if (scrollY < 0) {
        this._handleNegativeScroll(scrollY)
      } else {
        this._handlePositiveScroll(scrollY)
      }
    }

    _initScrollTop() {
      (this.$refs.scroll as any).$el.style.top =
        (this.imgHeight = (this.$refs.avatar as HTMLElement).clientHeight) + 'px'
    }

    _handleNegativeScroll(y: number) {
      console.log(y) // placeHolder
    }

    _handlePositiveScroll(y: number) {
      console.log(y) // placeHolder
    }

    _initHandleNegativeScroll() {
      this._handleNegativeScroll = (() => {
        let reachTop = false

        const maxScroll = this.imgHeight - RESERVED_HEIGHT
        const avatarStyle = (this.$refs.avatar as any).style
        const layerStyle = (this.$refs.layer as any).style

        const setAvatarStyle =
          (paddingTop: string, height: string, zIndex: string) => {
            avatarStyle.paddingTop = paddingTop
            avatarStyle.height = height
            avatarStyle.zIndex = zIndex
          }

        const handleScrolling = (y: number) => {
          layerStyle[transform] = `translate3d(0, ${-y}px, 0)`
          setAvatarStyle('70%', '0', '')
          reachTop = false
        }

        const handleReachTop = () => {
          if (reachTop) {
            return
          }
          setAvatarStyle('0', `${RESERVED_HEIGHT}px`, ZINDEX)
          reachTop = true
        }

        return (y: number) => {
          y = Math.abs(y)
          if (y < maxScroll) {
            return handleScrolling(y)
          } else {
            return handleReachTop()
          }
        }
      })()
    }

    _initHandlePositiveScroll() {
      this._handlePositiveScroll = (() => {
        const avatarStyle = (this.$refs.avatar as any).style

        return (y: number) => {
          const scale = y / this.imgHeight + 1
          avatarStyle[transform] = `scale(${scale})`
          avatarStyle.zIndex = ZINDEX
        }
      })()
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'
  @import '~assets/stylus/mixin.styl'

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
        padding 10px
        font-size $font-size-large-x
        color $color-theme

    .title
      position absolute
      z-index 40
      width 100%
      top 0
      left 0
      no-wrap()
      text-align center
      line-height 40px
      font-size $font-size-large
      color $color-text

    .avatar
      position relative
      width 100%
      height 0
      padding-top 70%
      background-size cover

      .filter
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background rgba(7, 17, 27, 0.4)

    .bg-layer
      position: relative;
      width 100%
      height 100%
      background $color-background

    .songs-scroll
      position absolute
      top 0
      bottom 0
      width 100%

      .songs-list-wrapper
        padding 20px 30px

      .loading
        position absolute
        top 50%
        transform translateY(-50%)
</style>
