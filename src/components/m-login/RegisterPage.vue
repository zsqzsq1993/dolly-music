<template>
  <form class="m-register-page">
    <ul>
      <li class="register-item user-name">
        <span class="text">用户名</span>
        <input type="text" class="content">
      </li>
      <li class="register-item e-mail">
        <span class="text">邮箱</span>
        <input type="email" class="content">
      </li>
      <li class="register-item validating-code">
        <span class="text">验证码</span>
        <input type="text" class="content">
      </li>
      <li class="register-item password">
        <span class="text">密码</span>
        <input type="password" class="content">
      </li>
      <li class="register-item password-repeat">
        <span class="text">确认密码</span>
        <input type="password" class="content">
      </li>
      <li class="register-item submit-wrapper">
        <input type="submit" value="submit" class="submit">
      </li>
    </ul>
  </form>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component
  export default class extends Vue {
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-register-page
    .register-item
      margin-bottom 30px
      width 100%
      display flex

      .text
        flex 1
        text-align center

      .content
        flex 2
        border-radius 5px

    .submit-wrapper
      justify-content center
      align-items center
      .submit
        padding 4px 10px
        color $color-sub-theme
        background-color $color-text
        border-radius 10px
</style>
