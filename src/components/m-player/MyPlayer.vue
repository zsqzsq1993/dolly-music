<template>
  <div class="m-player" v-show="playList.length > 0">
    <transition name="normal"
                @before-enter="beforeEnter"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="bg-image">
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <div class="top-wrapper">
          <div class="icon-wrapper" @click="minimize">
            <i class="icon-back"></i>
          </div>
          <h1 class="song-name" v-html="currentSong.songname"></h1>
          <h2 class="song-singer" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle-wrapper"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend.prevent="middleTouchEnd">
          <div class="middle-wrapper-left" ref="left">
            <div class="cd-wrapper" ref="cd">
              <img class="cd"
                   :class="animateClass"
                   :src="currentSong.image">
            </div>
            <div class="shortcut-lyric-wrapper">
              {{currentLyric}}
            </div>
          </div>
          <div class="middle-wrapper-right" ref="right">
            <scroll ref="scroll"
                    class="lyric-wrapper"
                    :data="lyrics">
              <div>
                <li ref="lyrics"
                    class="lyric-content"
                    :class="{'highlight': highLightIndex === idx}"
                    v-for="(line, idx) in lyrics"
                    :key="line.time + idx">
                  {{line.text}}
                </li>
              </div>
            </scroll>
          </div>
        </div>
        <div class="bottom-wrapper">
          <div class="dots-wrapper">
            <ul>
              <li class="dot" :class="{'current': currentPage === 0}"></li>
              <li class="dot" :class="{'current': currentPage === 1}"></li>
            </ul>
          </div>
          <div class="progress-wrapper">
            <span class="played-time time">{{currentTime | timeFilter}}</span>
            <span class="progress-bar">
              <progress-bar
                :percentage="percentage"
                @percent-change="handlePercentChange"
                @percent-changing="handlePercentChanging">
              </progress-bar>
            </span>
            <span class="total-time time">{{currentSong.interval | timeFilter}}</span>
          </div>
          <div class="controls-wrapper">
            <div class="play-mode-button icon-wrapper i-left" @click="changePlayMode">
              <i :class="playModeIcon"></i>
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
            <div class="favourite-song-wrapper icon-wrapper i-right" @click.stop="toggleFavorite(currentSong)">
              <i :class="getIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="maximize">
        <div class="avatar-wrapper" ref="miniCd">
          <img :src="currentSong.image"
               class="avatar"
               :class="animateClass">
        </div>
        <div class="content-wrapper">
          <h1 class="song-name" v-html="currentSong.songname"></h1>
          <h2 class="song-singer" v-html="currentSong.singer"></h2>
        </div>
        <div class="play-button-wrapper icon-wrapper"
             @click.stop="togglePlaying">
          <progress-circle :percentage="percentage">
            <i class="icon icon-play" :class="playIconMini"></i>
          </progress-circle>
        </div>
        <div class="expansion-button-wrapper icon-wrapper" @click.stop="showPlayList">
          <i class="icon-playlist icon"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playList"></play-list>
    <audio :src="currentSong.url"
           ref="audio"
           @error="onerror"
           @canplay="onready"
           @timeupdate="onTimeUpdate"
           @ended="autoNextOrLoop">
    </audio>
  </div>
</template>

<script lang="ts">
  import {Component, Mixins, Watch} from 'vue-property-decorator'
  import {Getter, Mutation, Action} from 'vuex-class'
  import {Song} from 'src/assets/ts/Song'
  import * as types from 'src/store/mutation-types'
  import {prefixStyle} from 'src/assets/ts/dom'
  import ProgressBar from 'base/m-progress-bar/ProgressBar.vue'
  import ProgressCircle from 'src/base/m-progress-circle/ProgressCircle.vue'
  import {playmode} from 'src/assets/ts/config'
  import Scroll from 'base/m-scroll/Scroll.vue'
  import lyricParser, {LyricParser} from 'src/assets/ts/lyricParser'
  import PlayList from 'components/m-playlist/PlayList.vue'
  import {PlayerMixin} from 'src/assets/ts/mixins'

  const transform = prefixStyle('transform') || 'transform'
  const PAGE_CD = 0
  const PAGE_LYRIC = 1

  interface TransitionConfig {
    setTransform?: boolean;
    useDefaultTransform?: boolean;
    setTransition?: boolean;
    done?: boolean;
    callback?: any;
  }

  interface Line {
    time: number;
    text: string;
  }

  interface MiddleTouch {
    activated?: boolean;
    pageX?: number;
    pageY?: number;
    percentage?: number;
    valid?: boolean;
  }

  @Component({
    filters: {
      timeFilter(timestamp: number) {
        timestamp = timestamp | 0
        const minitue = (timestamp / 60 | 0).toString()
        let second = (timestamp % 60).toString()
        if (second.length === 1) {
          second = '0' + second
        }
        return `${minitue}:${second}`
      }
    },

    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      PlayList
    }
  })
  export default class extends Mixins(PlayerMixin) {
    @Getter('playList') playList!: Array<Song>
    @Getter('fullScreen') fullScreen!: boolean
    @Getter('playing') playing!: boolean
    @Getter('currentIndex') currentIndex!: number
    @Getter('playMode') playMode!: number

    @Mutation(types.SET_FULL_SCREEN) setfullScreen: any
    @Mutation(types.SET_PLAYING_STATE) setPlayingState: any
    @Mutation(types.SET_CURRENT_INDEX) setCurrentIndex: any

    @Action('addOneHistory') addOneHistory: any

    cd: HTMLElement | undefined = undefined
    posAndScale: any = undefined
    audio: HTMLAudioElement | undefined = undefined
    currentPage = PAGE_CD
    audioReady = false
    currentTime = 0
    lyrics: Array<Line> = []
    middleTouch: MiddleTouch = {}
    highLightIndex = 0
    lyricParser: LyricParser | null = null
    currentLyric = ''

    @Watch('song')
    startToPlay(newSong: Song, oldSong: Song) {
      if (newSong.songid === oldSong.songid || !Object.keys(newSong).length) {
        return
      }
      if (!this.playing) {
        this.togglePlaying(true)
      } else {
        this.$nextTick(() => {
          this.play()
        })
      }
    }

    @Watch('song')
    getLyric(newSong: Song, oldSong: Song) {
      if (newSong.songid === oldSong.songid || !Object.keys(newSong).length) {
        return
      }
      newSong.getLyric().then((lyric: string) => {
        const obj = this.lyricParser = lyricParser(lyric, this.currentSong.interval)
        this.lyrics = obj.lines
        obj.play(this._playCallback)
      }).then(() => {
        this.addOneHistory({
          history: this.currentSong,
          flag: 'play'
        })
      }).catch(() => {
        this.lyricParser = null
        this.lyrics = []
        this._setCurrentLyric(this.currentIndex)
      })
    }

    @Watch('song')
    defaultPageCd() {
      this.currentPage = PAGE_CD
      this._setTransform('0')
      this._blurLeftWrapper(true, 1)
    }

    @Watch('playing')
    playOrPause(newVal: boolean) {
      this.$nextTick(() => {
        newVal
          ? this.play()
          : this.pause()
      })
    }

    @Watch('playing')
    playOrPauseLyric(newVal: boolean) {
      this.toggleLyric(newVal)
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

    get playIconMini() {
      const disable = this.audioReady
        ? ''
        : 'disabled'
      const icon = this.playing
        ? 'icon-pause-mini'
        : 'icon-play-mini'
      return icon + ' ' + disable
    }

    get animateClass() {
      return this.playing
        ? 'play'
        : 'play pause'
    }

    get percentage() {
      return this.currentTime / this.currentSong.interval
    }

    onready() {
      this.audioReady = true
    }

    onerror() {
      console.warn('loading audio resource error, try another song.')
      this.audioReady = true
    }

    onTimeUpdate(event: Event) {
      const target = event.target as HTMLAudioElement
      this.currentTime = target.currentTime
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

    autoNextOrLoop() {
      if (this.playMode === playmode.loop) {
        this.audio!.currentTime = 0
        if (!this.playing) {
          this.togglePlaying()
        } else {
          this.play()
        }
        this.lyricParser && this.lyricParser.repeat()
      } else {
        this.next()
      }
    }

    togglePlaying(bool?: boolean | Event) {
      if (typeof bool !== 'boolean') {
        this.setPlayingState(!this.playing)
      } else {
        this.setPlayingState(bool)
      }
    }

    toggleLyric(playing: boolean) {
      if (this.lyricParser) {
        playing
          ? this.lyricParser.restart()
          : this.lyricParser.pause()
      }
    }

    showPlayList() {
      (this.$refs.playList as any).show()
    }

    minimize() {
      this.setfullScreen(false)
    }

    maximize() {
      this.setfullScreen(true)
    }

    handlePercentChange(percentage: number) {
      const currentTime = percentage * this.currentSong.interval
      this.changeCurrentTime(currentTime)
      this.changeLyricTime(currentTime)
    }

    handlePercentChanging(percentage: number) {
      const currentTime = percentage * this.currentSong.interval
      this.changeLyricTime(currentTime)
    }

    changeCurrentTime(currentTime: number) {
      this.audio!.currentTime = currentTime
      this.togglePlaying(true)
    }

    changeLyricTime(currentTime: number) {
      this.lyricParser && this.lyricParser.seek(currentTime)
    }

    middleTouchStart(event: TouchEvent) {
      this.middleTouch.activated = true
      this.middleTouch.pageX = event.touches[0].pageX
      this.middleTouch.pageY = event.touches[0].pageY
      this._setTransition(false)
    }

    middleTouchMove(event: TouchEvent) {
      if (!this.middleTouch.activated) {
        return
      }

      const deltaX = event.touches[0].pageX - this.middleTouch.pageX!
      const deltaY = event.touches[0].pageY - this.middleTouch.pageY!

      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      if (absDeltaX > absDeltaY) {
        this._dispatchTransform(deltaX)
      }
    }

    middleTouchEnd() {
      if (!this.middleTouch.valid) {
        return
      }

      if (this.middleTouch.percentage! > 0.2) {
        this.currentPage = (this.currentPage + 1) % 2
      }

      this._setTransition(true)

      if (this.currentPage === PAGE_CD) {
        this._setTransform('0')
        this._blurLeftWrapper(true, 1)
      } else {
        this._setTransform('-100%')
        this._blurLeftWrapper(true, 0)
      }

      this.middleTouch.activated = false
      this.middleTouch.valid = false
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

    _setTransform(delta: string) {
      ((this.$refs.right as HTMLElement).style as any)[transform] = `translate3d(${delta}, 0, 0)`
    }

    _calPercentage(delta: number) {
      this.middleTouch.percentage = Math.abs(delta) / window.innerWidth
    }

    _setTransition(set: boolean, duration?: number) {
      duration = duration || 300

      if (set) {
        (this.$refs.right as HTMLElement).style.transitionDuration = `${duration}ms`
      } else {
        (this.$refs.right as HTMLElement).style.transitionDuration = ''
      }
    }

    _dispatchTransform(delta: number) {
      if (delta < 0 && this.currentPage === PAGE_CD) {
        this._setTransform(delta + 'px')
        this._calPercentage(delta)
        this._blurLeftWrapper(false)
        this.middleTouch.valid = true
      } else if (delta > 0 && this.currentPage === PAGE_LYRIC) {
        this._setTransform(-window.innerWidth + delta + 'px')
        this._calPercentage(delta)
        this._blurLeftWrapper(true)
        this.middleTouch.valid = true
      }
    }

    _blurLeftWrapper(positiveRelation: boolean, percentage?: number) {
      if (typeof percentage !== 'undefined') {
        ((this.$refs.left as HTMLElement).style as any).opacity = percentage
      } else {
        ((this.$refs.left as HTMLElement).style as any).opacity = positiveRelation
          ? this.middleTouch.percentage!
          : 1 - this.middleTouch.percentage!
      }
    }

    _highLightLyric(index: number) {
      this.highLightIndex = index
    }

    _scrollToHightLight(index: number) {
      if (index > 5) {
        (this.$refs.scroll as any).scrollToElement((this.$refs.lyrics as any)[index - 5], 1000)
      } else {
        (this.$refs.scroll as any).scrollTo(0, 0, 1000)
      }
    }

    _setCurrentLyric(index: number) {
      try {
        this.currentLyric = (this.lyrics as any)[index].text
      } catch (e) {
        this.currentLyric = '抱歉，未检索到歌词'
      }
    }

    _playCallback(index: number) {
      this._highLightLyric(index)
      this._scrollToHightLight(index)
      this._setCurrentLyric(index)
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
          width 70%
          margin 0 auto
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
        white-space nowrap
        font-size 0

        .middle-wrapper-left
          display inline-block
          position relative
          width 100%
          height 0
          padding-top 80%
          vertical-align top

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

          .shortcut-lyric-wrapper
            margin 30px auto 0
            width 80%
            height 20px
            line-height 20px
            text-align center
            overflow hidden
            color $color-text-l
            font-size $font-size-median

        .middle-wrapper-right
          display inline-block
          width 100%
          height 100%
          overflow hidden

          .lyric-wrapper
            width 80%
            height 100%
            margin 0 auto
            text-align center

            .lyric-content
              display block
              width 100%
              line-height 32px
              font-size $font-size-median
              color $color-text-l
              white-space normal
              &.highlight
                color $color-theme

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
          align-items center
          width 80%
          margin 0 auto
          padding 10px 0

          .progress-bar
            flex: 1

          .time
            flex 0 0 30px
            line-height 30px
            vertical-align top
            font-size $font-size-small
            color $color-text

            &.played-time
              text-align left

            &.total-time
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
        overflow hidden

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
        width 30px
        height 30px
        padding 0 10px

        .icon
          color $color-theme-d
          font-size 30px

          &.icon-play
            font-size 32px
            position absolute
            top 0
            left 0
</style>
