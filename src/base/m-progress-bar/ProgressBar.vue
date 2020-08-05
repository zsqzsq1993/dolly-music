<template>
    <div class="m-progress-bar">
      <div class="total-progress" ref="total">
        <div class="played-progress" ref="played"></div>
        <div class="progress-button"
             ref="button"
             @touchstart.prevent="touchstart"
             @touchmove.prevent="touchmove"
             @touchend.prevent="touchend">
          <div class="progress-button-image"></div>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
    import {Prop, Component, Vue, Watch} from 'vue-property-decorator'

    interface MyTouch {
      activated: boolean;
      touchX: number;
      left: number;
      percentage: number;
    }

    @Component
    export default class extends Vue {
      @Prop({default: 0}) readonly percentage!: number

      @Watch('percentage')
      whenPercentChange(percentage: number) {
        if (!this.touch.activated) {
          this.changeBarPosition(percentage)
        }
      }

      refTotal: HTMLElement | undefined = undefined
      refPlayed: HTMLElement | undefined = undefined
      refButton: HTMLElement | undefined = undefined
      touch: MyTouch = {
        activated: false,
        touchX: 0,
        left: 0,
        percentage: 0
      }

      mounted() {
        this.initRefs()
      }

      changeBarPosition(percentage: number) {
        this.changePlayedProgress(percentage)
        this.changeButtonPosition(percentage)
      }

      changePlayedProgress(percent: number) {
        this.refPlayed!.style.width = this.refTotal!.clientWidth * percent + 'px'
      }

      changeButtonPosition(percent: number) {
        this.refButton!.style.left = this.refTotal!.clientWidth * percent + 'px'
      }

      initRefs() {
        this.refTotal = this.$refs.total as HTMLElement
        this.refPlayed = this.$refs.played as HTMLElement
        this.refButton = this.$refs.button as HTMLElement
      }

      touchstart(event: TouchEvent) {
        this.touch.activated = true
        this.touch.touchX = event.touches[0].pageX
        this.touch.left = this.refPlayed!.clientWidth
        this.touch.percentage = this.percentage
      }

      touchmove(event: TouchEvent) {
        if (this.touch.activated) {
          const percentage = this._getPercentage(event.touches[0])
          this.changeBarPosition(percentage)
          this.touch.percentage = percentage
        }
      }

      touchend() {
        this.touch.activated = false
        this._triggerPercentage()
      }

      _getPercentage(touch: Touch) {
        const delta =  touch.pageX - this.touch.touchX
        const percentage = (delta + this.touch.left) / this.refTotal!.clientWidth
        return Math.max(0, Math.min(percentage, 1))
      }

      _triggerPercentage() {
        this.$emit('touch-end', this.touch.percentage)
      }
    }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-progress-bar
    .total-progress
      position relative
      width 100%
      height 4px
      background rgba(0, 0, 0, 0.3)
      border-radius 5px
      .played-progress
        width 0
        height 100%
        background  $color-theme
      .progress-button
        position absolute
        left -4px
        top -6px
        width 16px
        height 16px
        .progress-button-image
          width 100%
          height 100%
          box-sizing border-box
          border 3px solid $color-text
          border-radius 50%
          background $color-theme
</style>
