<template>
  <div class="m-scroll">
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
    @Prop({default: false}) readonly click!: boolean
    @Prop({default: false}) readonly listenScroll!: boolean
    @Prop({default: true}) readonly momentum!: boolean

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
      this.scroll = new BScroll('.m-scroll', {
        probeType: this.probType,
        click: this.click,
        momentum: this.momentum
      })

      if (this.listenScroll) {
        this._listenScroll()
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

<style lang="stylus">
  .m-scroll
    width 100%
    height 100%
    overflow hidden
</style>
