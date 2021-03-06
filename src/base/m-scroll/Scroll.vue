<template>
  <div class="m-scroll" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import {Prop, Component, Vue, Watch} from 'vue-property-decorator'
  import BScroll from '@better-scroll/core'

  @Component
  export default class extends Vue {
    @Prop({default: null}) readonly data!: any
    @Prop({default: 1}) readonly probType!: number
    @Prop({default: true}) readonly click!: boolean
    @Prop({default: false}) readonly listenScroll!: boolean
    @Prop({default: true}) readonly momentum!: boolean
    @Prop({default: false}) readonly pullUp!: boolean
    @Prop({default: false}) readonly pullDown!: boolean

    @Watch('data')
    whenDataChange() {
      this.$nextTick(() => {
        this.refresh()
      })
    }

    scroll: null | BScroll = null

    mounted() {
      this.$nextTick(() => {
        this._initScroll()
      })
    }

    _initScroll() {
      const wrapper = this.$refs.wrapper as HTMLElement

      if (!wrapper) {
        return
      }

      this.scroll = new BScroll(wrapper, {
        probeType: this.probType,
        click: this.click,
        momentum: this.momentum
      })

      if (this.listenScroll) {
        this._listenScroll()
      }

      if (this.pullUp) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll!.y <= this.scroll!.maxScrollY + 50) {
            this.$emit('scrollToEnd')
          }
        })
      }

      if (this.pullDown) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll!.y >= this.scroll!.maxScrollY + 50) {
            this.$emit('scrollToTop')
          }
        })
      }
    }

    refresh() {
      this.scroll && this.scroll.refresh()
    }

    enable() {
      this.scroll && this.scroll.enable()
    }

    disable() {
      this.scroll && this.scroll.disable()
    }

    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    }

    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }

    _listenScroll() {
      this.scroll && this.scroll.on('scroll', (pos: any) => {
        this.$emit('onscroll', pos)
      })
    }
  }
</script>

<style lang="stylus"></style>
