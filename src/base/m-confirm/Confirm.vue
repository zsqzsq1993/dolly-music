<template>
  <transition name="confirm">
    <div class="m-confirm" v-show="showFlag">
      <div class="confirm-inner-wrapper">
        <div class="confirm-content" v-text="remindText"></div>
        <div class="confirm-controllers">
          <div class="button-wrapper left" v-text="leftButtonText" @click.stop="clickLeft"></div>
          <div class="button-wrapper right" v-text="rightButtonText" @click.stop="clickRight"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
    import {Prop, Component, Vue} from 'vue-property-decorator'

    @Component
    export default class extends Vue {
      @Prop({default: '是否清空所有搜索历史'}) remindText: string;
      @Prop({default: '取消'}) leftButtonText: string;
      @Prop({default: '清空'}) rightButtonText: string;

      showFlag = false

      show() {
        this.showFlag = true
      }

      hide() {
        this.showFlag = false
      }

      clickLeft() {
        this.$emit('click-left')
      }

      clickRight() {
        this.$emit('click-right')
      }
    }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  @keyframes confirm-fadein
    0%
      opacity 0
    100%
      opacity 1

  @keyframes confirm-zoom
    0%
      transform scale(0)
    60%
      transform scale(1.1)
    100%
      transform scale(1)

  .confirm-enter-active
    animation confirm-fadein .3s
    .confirm-inner-wrapper
      animation confirm-zoom .3s

  .m-confirm
    position fixed
    display flex
    justify-content center
    align-items center
    top 0
    right 0
    bottom 0
    left 0
    background-color $color-background-d
    .confirm-inner-wrapper
      flex 0 0 270px
      width 270px
      border-radius 13px
      background-color $color-highlight-background
      .confirm-content
        padding 19px 15px
        line-height 22px
        text-align center
        color $color-text-l
        font-size $font-size-large
        border-bottom 1px solid $color-background-d
      .confirm-controllers
        display flex
        .button-wrapper
          flex 1
          padding 10px 0
          text-align center
          line-height 22px
          font-size $font-size-large
          color $color-text-d
          &.left
            border-right 1px solid $color-background-d

</style>
