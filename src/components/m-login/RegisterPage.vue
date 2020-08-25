<template>
  <form class="m-register-page" method="post">
    <div class="register-item">
      <label class="text" for="user-name">用户名</label>
      <input type="text"
             class="content"
             id="user-name"
             v-model="username"
             placeholder="6-12位"
             @blur="checkUsername">
    </div>
    <div class="register-item">
      <label class="text" for="e-mail">邮箱</label>
      <input type="email"
             class="content"
             id="e-mail"
             v-model="email"
             placeholder="eg: zsqzsq@gmail.com">
    </div>
    <div class="register-item">
      <label class="text" for="validating-code">验证码</label>
      <input type="text"
             class="content"
             id="validating-code"
             v-model="validateCode"
             placeholder="6位且区分大小写">
    </div>
    <div class="register-item">
      <label class="text" for="password">密码</label>
      <input type="password"
             class="content"
             id="password"
             v-model="password"
             placeholder="6-18位包含大小写及数字">
    </div>
    <div class="register-item">
      <label class="text" for="password-repeat">确认密码</label>
      <input type="password" class="content" id="password-repeat" v-model="passwordRepeat">
    </div>
    <div class="register-item submit-wrapper" @click="submit">
      <input type="submit" value="submit" class="submit">
    </div>
  </form>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component
  export default class extends Vue {
    username = ''
    email = ''
    validateCode = ''
    password = ''
    passwordRepeat: any = ''

    checkUsername() {
      return this.username &&
        this.username.length &&
        this.username.length >= 6 &&
        this.username.length <= 12
    }

    checkEmail() {
      return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(this.email)
    }

    checkValidateCode() {
      return this.validateCode.length === 6
    }

    checkPassword() {
      return /[A-Z]/.test(this.password) &&
        /[0-9]/.test(this.password) &&
        this.password.length >= 6 &&
        this.password.length <= 18
    }

    checkPasswordRepeat() {
      return this.password === this.passwordRepeat
    }

    submit() {
      //
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-register-page
    .register-item
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

    .submit-wrapper
      justify-content center
      align-items center

      .submit
        padding 6px 10px
        border-radius 20px
        color $color-theme
        background-color $color-highlight-background
        font-size $font-size-median-x
</style>
