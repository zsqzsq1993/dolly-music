<template>
    <div class="m-progress-circle">
      <svg :width="radius"
           :height="radius"
           viewBox="0 0 100 100"
           version="1.1"
           xmlns="http://www.w3.org/2000/svg">
        <circle class="circle-background"
                r="50"
                cx="50"
                cy="50"
                fill="transparent">
        </circle>
        <circle class="circle-progress"
                r="50"
                cx="50"
                cy="50"
                fill="transparent"
                :stroke-dasharray="dashArray"
                :stroke-dashoffset="dashOffset">
        </circle>
      </svg>
      <slot></slot>
    </div>
</template>

<script lang="ts">
    import {Prop, Component, Vue} from 'vue-property-decorator'

    @Component
    export default class extends Vue {
      @Prop({default: 32}) readonly radius!: number
      @Prop({default: 0}) readonly percentage!: number

      get dashArray() {
        return Math.PI * 100
      }

      get dashOffset() {
        return this.dashArray * (1 - this.percentage)
      }
    }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-progress-circle
    position relative
    circle
      stroke-width 8px
      transform-origin center
      &.circle-background
        transform: scale(0.9)
        stroke $color-theme-d
      &.circle-progress
        transform: scale(0.9) rotate(-90deg)
        stroke $color-theme
</style>
