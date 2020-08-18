<template>
  <transition name="drop">
    <div class="m-top-tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator'

    @Component
    export default class extends Vue {
      @Prop({default: 2000}) delay!: number

      showFlag = false
      timer = -1

      show() {
        this.showFlag = true
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.hide()
        }, this.delay)
      }

      hide() {
        this.showFlag = false
      }
    }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .drop-enter-active, .drop-leave-active
    transition all .4s
  .drop-enter, .drop-leave-to
    transform translate3d(0, -100%, 0)
  .drop-enter-to, .drop-leave
    transform translate3d(0, 0, 0)
  .m-top-tip
    background-color $color-dialog-background
</style>
