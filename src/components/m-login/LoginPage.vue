<template>
  <form class="m-login-page">
    <div class="login-item user-name">
      <span class="text">用户名</span>
      <input type="text"
             class="content"
             v-model="username"
             @focus="usernameFlag = true"
             @blur="checkUsername">
      <span class="error-reminder"
            v-show="username && !usernameFlag">用户名位数不正确</span>
    </div>
    <div class="login-item password">
      <span class="text">密码</span>
      <input type="password"
             class="content"
             v-model="password"
             @focus="passwordFlag = true"
             @blur="checkPassword">
      <span class="error-reminder"
            v-show="password && !passwordFlag">密码格式不正确</span>
    </div>
    <div class="login-item submit-wrapper">
      <input type="submit"
             value="login"
             class="submit"
             v-show="canLogin"
             @click.prevent.stop="login">
    </div>
  </form>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {login} from 'src/api/register'

  const md5 = require('blueimp-md5')

  @Component
  export default class extends Vue {
    username = ''
    password = ''
    usernameFlag = true
    passwordFlag = true

    get canLogin() {
      return this.username &&
        this.usernameFlag &&
        this.password &&
        this.passwordFlag
    }

    login() {
      if (this.canLogin) {
        login(
          this.username,
          md5(this.password)
        ).then(response => {
          this.$emit('remind', response)
        }).catch(error => {
          console.log(error)
        })
      }
    }

    checkUsername() {
      this.usernameFlag = (
        this.username.length &&
        this.username.length >= 6 &&
        this.username.length <= 12
      ) as boolean
    }

    checkPassword() {
      this.passwordFlag = /[A-Z]/.test(this.password) &&
        /[0-9]/.test(this.password) &&
        this.password.length >= 6 &&
        this.password.length <= 18
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-login-page
    .login-item
      position relative
      margin-bottom 30px
      width 100%
      display flex
      align-items center

      .text
        flex 1
        text-align center

      .content
        flex 2
        padding 4px 6px
        line-height 14px
        border-radius 8px
        color $color-text
        background-color $color-highlight-background
        outline 0

        &::placeholder
          color $color-text-d

      .error-reminder
        position absolute
        left  0
        bottom -100%
        margin-left 33%
        padding 2px 4px
        color $color-theme
        font-size $font-size-small
        line-height $font-size-small
        &.send-code
          border 1px solid $color-theme
          border-radius 5px

    .submit-wrapper
      justify-content center
      align-items center

      .submit
        padding 6px 10px
        border-radius 20px
        color $color-theme
        background-color $color-highlight-background
        font-size $font-size-median-x
        outline 0

</style>
