<template>
    <div class="m-slider" ref="sliderWrapper">
      <div class="slider-group" ref="sliderGroup">
        <slot></slot>
      </div>
    </div>
</template>

<script lang="ts">
    import { Prop, Component, Vue } from 'vue-property-decorator'
    import BScroll from '@better-scroll/core'

    @Component
    export default class Slider extends Vue {
      @Prop({default: true}) readonly momentum!: boolean

      slider: null | BScroll = null

      mounted() {
        this.$nextTick(() => {
          this._setInitialWidth()
          this._setInitialScroll()
        })
      }

      _setInitialWidth() {
        const sliderWrapper: HTMLElement = this.$refs.sliderWrapper as HTMLElement
        const sliderGroup: HTMLElement = this.$refs.sliderGroup as HTMLElement
        const unitWidth: number = sliderWrapper.clientWidth
        let totalWidth = 0

        for (let i = 0, len = sliderGroup.children.length; i < len; i++) {
          const child: HTMLElement = sliderGroup.children[i] as HTMLElement
          child.style.width = unitWidth + 'px'
          totalWidth += unitWidth
        }

        sliderGroup.style.width = totalWidth + 'px'
      }

      _setInitialScroll() {
        this.slider = new BScroll('.m-slider', {
          scrollX: true,
          scrollY: false
        })
      }
    }
</script>

<style lang="stylus">
  .m-slider
    width 100%
    height 100%
    white-space nowrap
    .slider-group
      display inline-block
      height 100%
      a
        display inline-block
        height 100%
      img
        width 100%
        height 100%
</style>
