<template>
  <transition name="slide-up">
    <div class="m-login" v-show="loginPageFlag">
      <div class="back-wrapper" @click.stop="setLoginPageFlag(false)">
        <i class="icon-close"></i>
      </div>
      <div class="image-wrapper">
        <img src="../../assets/images/pizza.png"
             alt="background-image">
      </div>
      <div class="switches-wrapper">
        <switches :tablist="namelist" @select-item="changeComponentIndex"></switches>
      </div>
      <div class="login-register-wrapper">
        <login-page v-show="!componentIndex"></login-page>
        <register-page v-show="componentIndex"></register-page>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {Mutation, Getter} from 'vuex-class'
  import * as types from 'src/store/mutation-types'
  import Switches from 'base/m-switches/Switches.vue'
  import LoginPage from './LoginPage.vue'
  import RegisterPage from './RegisterPage.vue'

  @Component({
    components: {
      Switches,
      LoginPage,
      RegisterPage
    }
  })
  export default class extends Vue {
    @Getter('loginPageFlag') readonly loginPageFlag!: boolean

    @Mutation(types.SET_LOGIN_PAGE_FLAG) setLoginPageFlag: any

    namelist = ['登陆', '注册']

    componentIndex = 0

    changeComponentIndex(index: number) {
      this.componentIndex = index
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .slide-up-enter-active, .slide-up-leave-active
    transition all .4s

  .slide-up-enter, .slide-up-leave-to
    transform translate3d(0, 100%, 0)

  .m-login
    position fixed
    z-index 300
    top 0
    right 0
    bottom 0
    left 0
    background-color $color-background-d
    backdrop-filter  blur(20px)

    .back-wrapper
      position absolute
      z-index 15
      top 0
      left 6px
      i
        display block
        padding 10px
        color $color-theme
        font-size $font-size-large-x

    .image-wrapper
      position relative
      z-index 10
      width 100%
      height 50%
      display flex
      justify-content center
      align-items center
      img
        flex 0 0
        width 180px
        height 180px

    .switches-wrapper
      position relative
      z-index 10
      width 80%
      margin 0 auto
      .m-switches
        border none

        .tab-button
          color $color-text-d
          &.active
            color $color-text
            background $color-highlight-background
            border-radius 20px

    .login-register-wrapper
      position relative
      z-index 10
      width 80%
      margin 30px auto
      color $color-text-d
      font-size $font-size-median
</style>
