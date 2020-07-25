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

    @Component
    export default class Slider extends Vue {
      @Prop({default: true}) readonly momentum!: boolean
      @Prop({default: true}) readonly loop!: boolean

      slider: null | BScroll = null
      currentIndex = 0
      dots: Array<undefined> = []

      mounted() {
        this.$nextTick(() => {
          this._setInitialDots()
          this._setInitialWidth()
          this._setInitialScroll()
        })
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

        // if (this.loop) {
        //   totalWidth += 2 * unitWidth
        // }

        sliderGroup.style.width = totalWidth + 'px'
      }

      _setInitialScroll() {
        BScroll.use(Slide)

        this.slider = new BScroll('.m-slider', {
          scrollX: true,
          scrollY: false,
          slide: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        })

        const slide = new Slide(this.slider!)

        this.slider.on('scrollEnd', () => {
          const currentPage = slide.getCurrentPage().pageX
          this.currentIndex = currentPage
        })
      }

      _setInitialDots() {
        this.dots = new Array<undefined>(
          (this.$refs.sliderGroup as HTMLElement).children.length
        )
      }
    }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-slider
    position: relative;
    width 100%
    height 100%
    .slider-group
      height 100%
      white-space nowrap
      overflow hidden
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
