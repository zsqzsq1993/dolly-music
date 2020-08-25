<template>
  <form class="m-login-page">
    <ul>
      <li class="login-item user-name">
        <span class="text">用户名</span>
        <input type="text" class="content">
      </li>
      <li class="login-item password">
        <span class="text">密码</span>
        <input type="password" class="content">
      </li>
      <li class="login-item submit-wrapper">
        <input type="submit" value="login" class="submit">
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

  .m-login-page
    .login-item
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
