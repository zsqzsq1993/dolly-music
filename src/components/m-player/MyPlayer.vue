<template>
  <div class="m-player" v-show="playList.length">
    <transition name="normal"
                @before-enter="beforeEnter"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="bg-image">
          <img :src="song.image" width="100%" height="100%">
        </div>
        <div class="top-wrapper">
          <div class="icon-wrapper" @click="minimize">
            <i class="icon-back"></i>
          </div>
          <h1 class="song-name" v-html="song.songname"></h1>
          <h2 class="song-singer" v-html="song.singer"></h2>
        </div>
        <div class="middle-wrapper">
          <div class="middle-wrapper-left">
            <div class="cd-wrapper" ref="cd">
              <img class="cd"
                   :class="animateClass"
                   :src="song.image">
            </div>
            <div class="lyrics-wrapper">
              hi, I am placeholder, more text overflow is hidden
            </div>
          </div>
          <div class="middle-wrapper-right"></div>
        </div>
        <div class="bottom-wrapper">
          <div class="dots-wrapper">
            <ul>
              <li class="dot"
                  v-for="(item, idx) in dots"
                  :key="idx"
                  :class="{'current': idx === dotIndex}"></li>
            </ul>
          </div>
          <div class="progress-wrapper">
            <span class="played-time time">0:01</span>
            <span class="progress-bar"></span>
            <span class="total-time time">4:22</span>
          </div>
          <div class="controls-wrapper">
            <div class="play-mode-button icon-wrapper i-left">
              <i class="icon-loop"></i>
            </div>
            <div class="prev-song-button icon-wrapper i-left"
                 @click="prev">
              <i class="icon-prev" :class="{'disabled' : !audioReady}"></i>
            </div>
            <div class="playing-button icon-wrapper i-center"
                 @click="togglePlaying">
              <i :class="playIcon"></i>
            </div>
            <div class="next-song-wrapper icon-wrapper i-right"
                 @click="next">
              <i class="icon-next" :class="{'disabled' : !audioReady}"></i>
            </div>
            <div class="favourite-song-wrapper icon-wrapper i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="maximize">
        <div class="avatar-wrapper" ref="miniCd">
          <img :src="song.image"
               class="avatar"
               :class="animateClass">
        </div>
        <div class="content-wrapper">
          <h1 class="song-name" v-html="song.songname"></h1>
          <h2 class="song-singer" v-html="song.singer"></h2>
        </div>
        <div class="play-button-wrapper icon-wrapper"
             @click.stop="togglePlaying">
          <i class="icon" :class="playIcon"></i>
        </div>
        <div class="expansion-button-wrapper icon-wrapper">
          <i class="icon-playlist icon"></i>
        </div>
      </div>
    </transition>
    <audio :src="song.url"
           ref="audio"
           @error="onerror"
           @canplay="onready">
    </audio>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator'
  import {Getter, Mutation} from 'vuex-class'
  import {Song} from 'src/assets/ts/Song'
  import * as types from 'src/store/mutation-types'
  import {prefixStyle} from 'src/assets/ts/dom'

  const transform = prefixStyle('transform') || 'transform'

  interface TransitionConfig {
    setTransform?: boolean;
    useDefaultTransform?: boolean;
    setTransition?: boolean;
    done?: boolean;
    callback?: any;
  }

  @Component
  export default class extends Vue {
    @Getter('playList') playList!: Array<Song>
    @Getter('fullScreen') fullScreen!: boolean
    @Getter('currentSong') song!: Song
    @Getter('playing') playing!: boolean
    @Getter('currentIndex') currentIndex!: number

    @Mutation(types.SET_FULL_SCREEN) setfullScreen: any
    @Mutation(types.SET_PLAYING_STATE) setPlayingState: any
    @Mutation(types.SET_CURRENT_INDEX) setCurrentIndex: any

    dots: Array<undefined> = Array(2)
    cd: HTMLElement | undefined = undefined
    posAndScale: any = undefined
    audio: HTMLAudioElement | undefined = undefined
    dotIndex = 0
    audioReady = false

    @Watch('song')
    whenSongChange() {
      if (!this.playing) {
        this.togglePlaying(true)
      } else {
        this.$nextTick(() => {
          this.play()
        })
      }
    }

    @Watch('playing')
    playOrPause(newVal: boolean) {
      this.$nextTick(() => {
        newVal
          ? this.play()
          : this.pause()
      })
    }

    get playIcon() {
      const disable = this.audioReady
        ? ''
        : 'disabled'
      const icon = this.playing
        ? 'icon-pause'
        : 'icon-play'
      return icon + ' ' + disable
    }

    get animateClass() {
      return this.playing
        ? 'play'
        : 'play pause'
    }

    onready() {
      this.audioReady = true
    }

    onerror() {
      console.warn('loading audio resource error, try another song.')
      this.audioReady = true
    }

    play() {
      const target = this.audio ||
        (this.audio = this.$refs.audio as HTMLAudioElement)
      target.play()
    }

    pause() {
      const target = this.audio ||
        (this.audio = this.$refs.audio as HTMLAudioElement)
      target.pause()
    }

    prev() {
      if (!this.audioReady) {
        return
      }

      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      this.audioReady = false
    }

    next() {
      if (!this.audioReady) {
        return
      }

      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      this.audioReady = false
    }

    togglePlaying(bool: boolean | Event) {
      typeof bool !== 'boolean'
        ? this.setPlayingState(!this.playing)
        : this.setPlayingState(bool)
    }

    minimize() {
      this.setfullScreen(false)
    }

    maximize() {
      this.setfullScreen(true)
    }

    beforeEnter() {
      this._transitionHookHelper({
        setTransform: true,
        useDefaultTransform: true
      })
    }

    enter(element: HTMLElement, done: any) {
      setTimeout(() => {
        this._transitionHookHelper({
          setTransform: true,
          useDefaultTransform: false,
          setTransition: true,
          callback: done
        })
      }, 20)
    }

    afterEnter() {
      this._transitionHookHelper({
        done: true
      })
    }

    leave(element: HTMLElement, done: any) {
      this._transitionHookHelper({
        setTransform: true,
        useDefaultTransform: true,
        setTransition: true,
        callback: done
      })
    }

    afterLeave() {
      this._transitionHookHelper({
        done: true
      })
    }

    _transitionHookHelper(config: TransitionConfig): void {
      const {
        setTransform,
        useDefaultTransform,
        setTransition,
        done,
        callback
      } = config
      const target = this.cd
        ? this.cd
        : (this.cd = this.$refs.cd as HTMLElement)

      if (setTransform) {
        const {x, y, scale} = useDefaultTransform
          ? this._getPosAndScale()
          : {x: 0, y: 0, scale: 1};

        (target.style as any)[transform] =
          `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      }

      if (setTransition) {
        (target.style as any).transition = 'all .4s'
      }

      if (done) {
        (target.style as any)[transform] = '';
        (target.style as any).transition = ''
      }

      if (callback) {
        target.addEventListener('transitionend', callback)
      }
    }

    _getPosAndScale() {
      if (this.posAndScale) {
        return this.posAndScale
      } else {
        const paddingLeft = 40
        const paddingTop = 80
        const paddingBottom = 30
        const halfViewPortWidth = window.innerWidth / 2
        const viewPortHeight = window.innerHeight
        const bigRadius = 0.8 * halfViewPortWidth
        const smalRadius = 20
        const x = paddingLeft - halfViewPortWidth
        const y = viewPortHeight - (paddingTop + paddingBottom + bigRadius)
        const scale = smalRadius / bigRadius
        return this.posAndScale = {x, y, scale}
      }
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'
  @import '~assets/stylus/mixin.styl'
  @keyframes rotate
    0%
      transform rotate(0)
    100%
      transform rotate(360deg)

  .m-player
    .normal-enter-active, .normal-leave-active
      transition all .4s

      .top-wrapper, .bottom-wrapper
        transition all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)

    .normal-enter, .normal-leave-to
      opacity 0

      .top-wrapper
        transform translate3d(0, -100%, 0)

      .bottom-wrapper
        transform translate3d(0, 100%, 0)

    .normal-player
      position fixed
      z-index 150
      top 0
      right 0
      bottom 0
      left 0
      background $color-background

      .bg-image
        position absolute
        z-index -1
        top 0
        right 0
        bottom 0
        left 0
        opacity 0.6
        filter: blur(20px)

      .top-wrapper
        position relative
        margin-bottom 25px

        .icon-wrapper
          position absolute
          z-index 50
          top 0
          left 6px

          .icon-back
            display block
            padding 9px
            color $color-theme
            font-size $font-size-large-x
            transform rotate(-90deg)

        .song-name
          z-index 40
          width 100%
          line-height 40px
          text-align center
          color $color-text
          font-size $font-size-large
          no-wrap()

        .song-singer
          z-index 40
          width 100%
          line-height 20px
          text-align center
          color $color-text
          font-size $font-size-median
          no-wrap()

      .middle-wrapper
        position absolute
        top 80px
        right 0
        bottom 170px
        left 0

        .middle-wrapper-left
          display inline-block
          position relative
          width 100%
          height 0
          padding-top 80%

          .cd-wrapper
            position absolute
            top 0
            left 10%
            width 80%
            height 100%

            .cd
              width 100%
              height 100%
              border-radius 50%
              box-sizing border-box
              border: 10px solid rgba(255, 255, 255, 0.1)

              &.play
                animation rotate 20s linear infinite

              &.pause
                animation-play-state paused

          .lyrics-wrapper
            margin 30px auto 0
            width 80%
            height 20px
            line-height 20px
            text-align center
            overflow hidden
            color $color-text-l
            font-size $font-size-median

      .bottom-wrapper
        position absolute
        bottom 50px
        left 0
        right 0

        .dots-wrapper
          text-align center

          .dot
            display inline-block
            margin 0 4px
            width 8px
            height 8px
            background $color-text-l
            border-radius 50%

            &.current
              width 20px
              border-radius 5px
              background $color-text-ll

        .progress-wrapper
          display flex
          justify-content space-between
          align-items center
          width 80%
          margin 0 auto
          padding 10px 0

        .time
          flex 0 0 30px
          line-height 30px
          vertical-align top
          font-size $font-size-small
          color $color-text

          .played-time
            text-align left

          .total-time
            text-align right

        .controls-wrapper
          display flex
          align-items center

          .icon-wrapper
            flex 1
            color $color-theme
            font-size 30px

            &.i-left
              text-align right

            &.i-center
              padding 0 20px
              font-size 40px
              text-align center

            &.i-right
              text-align left

            .disabled
              color $color-theme-d

    .mini-player
      display flex
      align-items center
      position fixed
      z-index 180
      bottom 0
      height 60px
      width 100%
      background $color-highlight-background

      .avatar-wrapper
        flex 0 0 40px
        height 40px
        padding 0 10px 0 20px

        .avatar
          width 100%
          height 100%
          border-radius 50%

          &.play
            animation rotate 20s linear infinite

          &.pause
            animation-play-state paused

      .content-wrapper
        flex 1
        display flex
        flex-direction column
        justify-content center
        line-height 20px

        .song-name
          margin-bottom 2px
          font-size $font-size-median
          color $color-text
          no-wrap()

        .song-singer
          font-size $font-size-small
          color $color-text-d
          no-wrap()

      .icon-wrapper
        flex 0 0 30px
        height 30px
        padding 0 10px

        .icon
          color $color-theme
          font-size 30px
</style>
