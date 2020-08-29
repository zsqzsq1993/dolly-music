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
        <div class="top-tip-wrapper">
          <top-tip ref="toptip" :delay="1000">
            <div class="reminder">
              <i :class="reminderCls"></i>
              <span class="text-wrapper" v-text="reminderText"></span>
            </div>
          </top-tip>
        </div>
        <div class="no-login" v-show="!loginInfo.status">
          <div class="switches-wrapper">
            <switches :tablist="namelist"
                      @select-item="changeComponentIndex"
                      ref="switches"></switches>
          </div>
          <div class="login-register-wrapper">
            <login-page v-show="!componentIndex"
                        @remind="reminding"
                        ref="login"></login-page>
            <register-page v-show="componentIndex"
                           @remind="reminding"
                           ref="register"></register-page>
          </div>
        </div>
        <div class="already-login" v-show="loginInfo.status">
          <div class="logout-wrapper" v-text="'logout'" @click="logoutUser"></div>
        </div>
      </div>
  </transition>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {Mutation, Getter, Action} from 'vuex-class'
  import * as types from 'src/store/mutation-types'
  import Switches from 'base/m-switches/Switches.vue'
  import LoginPage from './LoginPage.vue'
  import RegisterPage from './RegisterPage.vue'
  import TopTip from 'base/m-top-tip/TopTip.vue'
  import {logout} from 'src/api/register'

  @Component({
    components: {
      Switches,
      LoginPage,
      RegisterPage,
      TopTip
    }
  })
  export default class extends Vue {
    @Getter('loginPageFlag') readonly loginPageFlag!: boolean
    @Getter('loginInfo') readonly loginInfo!: any

    @Mutation(types.SET_LOGIN_PAGE_FLAG) setLoginPageFlag: any

    @Action('refreshLoginInfo') refreshLoginInfo: any

    namelist = ['登陆', '注册']

    componentIndex = 0

    reminderCls = ''

    reminderText = ''

    logoutBusyFlag = false

    changeComponentIndex(index: number) {
      this.componentIndex = index
    }

    reminding(response: any, flag: string) {
      const {code, message} = response

      this.reminderCls = code === 0
        ? 'icon-ok'
        : 'icon-close'

      this.reminderText = message;

      (this.$refs.toptip as any).show()

      console.log(flag)

      if (flag === 'register') {
        code === 0
          ? (this.$refs.register as any).clearAllInput()
          : (this.$refs.register as any).clearSomeInput()
        setTimeout(() => {
          (this.$refs.switches as any).selectItem(0)
        }, 800)
      } else {
        (this.$refs.login as any).clearAllInput()

        setTimeout(() => {
          this.setLoginPageFlag(false)
          this.refreshLoginInfo()
          this.logoutBusyFlag = false
        }, 1500)
      }
    }

    logoutUser() {
      if (this.logoutBusyFlag) {
        return
      }

      logout().then((response: any) => {
        this.logoutBusyFlag = true
        if (response.code === 0) {
          this.reminding(response, '')
        } else {
          throw response.error
        }
      }).catch(error => {
        console.log(error)
      })
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
    backdrop-filter blur(20px)

    .top-tip-wrapper
      position absolute
      z-index 30
      top 0
      left 0
      width 100%
      .reminder
        padding 18px 0
        text-align center
        i
          color $color-theme
          font-size $font-size-median
          margin-right 4px
        span
          color $color-text
          font-size $font-size-median

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
      height 30%
      display flex
      justify-content center
      align-items center

      img
        flex 0 0
        width 180px
        height 180px

    .no-login
      z-index 10
      .switches-wrapper
        position relative
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
        width 80%
        margin 25px auto
        color $color-text-d
        font-size $font-size-median

    .already-login
      position absolute
      z-index 10
      display flex
      justify-content center
      align-items center
      top 0
      right 0
      bottom 0
      left 0
      .logout-wrapper
        padding 10px 20px
        color $color-theme
        border 1px solid $color-theme
        border-radius 10px
</style>
