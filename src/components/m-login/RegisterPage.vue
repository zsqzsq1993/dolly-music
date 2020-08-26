<template>
  <form class="m-register-page" method="post">
    <div class="register-item">
      <label class="text" for="user-name">用户名</label>
      <input type="text"
             class="content"
             id="user-name"
             v-model="username"
             placeholder="6-12位"
             @focus="usernameFlag = true"
             @blur="checkUsername">
      <span class="error-reminder"
            v-show="username && !usernameFlag">用户名位数不正确</span>
    </div>
    <div class="register-item">
      <label class="text" for="e-mail">邮箱</label>
      <input type="email"
             class="content"
             id="e-mail"
             v-model="email"
             placeholder="eg: zsqzsq@gmail.com"
             @focus="emailFlag = true">
      <span class="error-reminder send-code"
            v-show="emailFlag"
            @click="sendCode"
            v-text="sender"></span>
      <span class="error-reminder" v-show="!emailFlag">邮箱格式不正确</span>
    </div>
    <div class="register-item">
      <label class="text" for="validating-code">验证码</label>
      <input type="text"
             class="content"
             id="validating-code"
             v-model="validateCode"
             placeholder="6位且区分大小写"
             @focus="validateCodeFlag = true"
             @blur="checkValidateCode">
      <span class="error-reminder"
            v-show="validateCode && !validateCodeFlag">验证码位数不正确</span>
    </div>
    <div class="register-item">
      <label class="text" for="password">密码</label>
      <input type="password"
             class="content"
             id="password"
             v-model="password"
             placeholder="6-18位包含大小写及数字"
             @focus="passwordFlag = true"
             @blur="checkPassword">
      <span class="error-reminder"
            v-show="password && !passwordFlag">密码格式不正确</span>
    </div>
    <div class="register-item">
      <label class="text" for="password-repeat">确认密码</label>
      <input type="password"
             class="content"
             id="password-repeat"
             v-model="passwordRepeat"
             @focus="passwordRepeatFlag = true"
             @blur="checkPasswordRepeat">
      <span class="error-reminder"
            v-show="passwordRepeat && !passwordRepeatFlag">两次输入密码不相同</span>
    </div>
    <div class="register-item submit-wrapper">
      <input type="submit"
             value="register"
             class="submit"
             @click.prevent.stop="submit"
             v-show="canSubmit">
    </div>
  </form>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {verify, register} from 'src/api/register'
  import TopTip from 'base/m-top-tip/TopTip.vue'

  const md5 = require('blueimp-md5')

  @Component({
    components: {
      TopTip
    }
  })
  export default class extends Vue {
    username = 'zsqzsq1993'
    email = 'zsqzsq1993@yeah.net'
    validateCode = ''
    password = 'Findahouse153!'
    passwordRepeat = 'Findahouse153!'
    sender = '发送验证码'
    senderBusyFlag = false

    usernameFlag = true
    emailFlag = true
    validateCodeFlag = true
    passwordFlag = true
    passwordRepeatFlag = true

    get canSubmit() {
      return this.username && this.usernameFlag &&
        this.email && this.emailFlag &&
        this.validateCode && this.validateCodeFlag &&
        this.password && this.passwordFlag &&
        this.passwordRepeat && this.passwordRepeatFlag
    }

    submit() {
      if (this.canSubmit) {
        register({
          username: this.username,
          email: this.email,
          validateCode: this.validateCode,
          password: md5(this.password)
        }).then(response => {
          this.$emit('remind', response)
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

    checkEmail() {
      return this.emailFlag = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(this.email)
    }

    checkValidateCode() {
      this.validateCodeFlag = this.validateCode.length === 4
    }

    checkPassword() {
      this.passwordFlag = /[A-Z]/.test(this.password) &&
        /[0-9]/.test(this.password) &&
        this.password.length >= 6 &&
        this.password.length <= 18
    }

    checkPasswordRepeat() {
      this.passwordRepeatFlag = this.password === this.passwordRepeat
    }

    sendCode() {
      if (this.senderBusyFlag) {
        return
      }

      if (this.checkEmail()) {
        this.senderBusyFlag = true

        verify(this.email).then(message => {
          let countdown = 60

          this.sender = `${message} ${countdown--}秒`

          const step = () => {
            setTimeout(() => {
              this.sender = `${message} ${countdown--}秒`
              if (countdown === 0) {
                this.sender = '发送验证码'
                this.senderBusyFlag = false
              } else {
                step()
              }
            }, 1000)
          }

          step()
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-register-page
    .register-item
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
