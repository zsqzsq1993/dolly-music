<template>
    <div class="m-slider" ref="sliderWrapper">
      <div class="slider-group" ref="sliderGroup">
        <slot></slot>
      </div>
      <div class="dots">
        <span class="dot"
              v-for="(item , idx) in dots"
              :key="idx"
              :class="{'dot-active': currentIndex === idx}">
        </span>
      </div>
    </div>
</template>

<script lang="ts">
    import { Prop, Component, Vue } from 'vue-property-decorator'
    import BScroll from '@better-scroll/core'
    import Slide from '@better-scroll/slide'
    import {addClass} from '@/assets/ts/classHelper.ts'
    import {Page} from '@better-scroll/slide/dist/types/SlidePage'

    BScroll.use(Slide)

    @Component
    export default class Slider extends Vue {
      @Prop({default: true}) readonly momentum!: boolean
      @Prop({default: true}) readonly loop!: boolean
      @Prop({default: true}) readonly autoplay!: boolean
      @Prop({default: 4000}) readonly interval!: number

      slider: null | BScroll = null
      currentIndex = 0
      dots: Array<undefined> = []
      playTimer = 0

      mounted() {
        this.$nextTick(() => {
          this._setInitialDots()
          this._setInitialWidth()
          this._setInitialScroll()
          this._setListeners()
        })
      }

      beforeDestroy() {
        clearTimeout(this.playTimer)
        this.playTimer = 0
      }

      _setInitialWidth() {
        const sliderWrapper: HTMLElement = this.$refs.sliderWrapper as HTMLElement
        const sliderGroup: HTMLElement = this.$refs.sliderGroup as HTMLElement
        const unitWidth: number = sliderWrapper.clientWidth
        const sliderLen = sliderGroup.children.length
        const totalWidth = sliderLen * unitWidth

        for (let i = 0, len = sliderLen; i < len; i++) {
          const child: HTMLElement = sliderGroup.children[i] as HTMLElement
          addClass(child, 'slider-item')
          child.style.width = unitWidth + 'px'
        }

        sliderGroup.style.width = totalWidth + 'px'
      }

      _setInitialScroll() {
        this.slider = new BScroll('.m-slider', {
          scrollX: true,
          scrollY: false,
          slide: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        })
      }

      _setInitialDots() {
        this.dots = new Array<undefined>(
          (this.$refs.sliderGroup as HTMLElement).children.length
        )
      }

      _setListeners() {
        // dot follows the index
        this.slider && this.slider.on('slideWillChange', (page: Page) => {
          this.currentIndex = page.pageX
        })

        // autoplay
        if (this.autoplay) {
          this._nextPage()
          this.slider && this.slider.on('scrollEnd', () => {
            clearTimeout(this.playTimer)
            this._nextPage()
          })
        }

        // resizable
        window.addEventListener('resize', () => {
          this._setInitialWidth()
          this.slider && this.slider.refresh()
        })
      }

      _nextPage() {
        this.playTimer = setTimeout(() => {
          this.slider && this.slider.next()
        }, this.interval)
      }
    }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-slider
    position: relative;
    width 100%
    height 100%
    overflow hidden
    .slider-group
      height 100%
      white-space nowrap
      .slider-item
        float left
        overflow hidden
        a
          height 100%
          img
            width 100%
            height 100%
    .dots
      position absolute
      left 0
      right 0
      bottom 12px
      text-align center
      font-size 0
      .dot
        display inline-block
        margin 0 4px
        width 8px
        height 8px
        border-radius 50%
        background $color-text-l
        &.dot-active
          width 20px
          border-radius 5px
          background $color-text-ll
</style>
