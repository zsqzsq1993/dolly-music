<template>
    <div class="m-user-center-controller">
      <div class="login-wrapper">
        <div class="avatar-wrapper">
          <i class="icon-user-photo"></i>
        </div>
        <div class="description">登陆立享云端同步</div>
      </div>
      <ul class="controllers-wrapper">
        <div class="controller-button-wrapper">
          <i class="icon icon-user-favorite"></i>
          <p class="description">我喜欢的</p>
        </div>
        <div class="controller-button-wrapper">
          <i class="icon icon-user-music"></i>
          <p class="description">最近听的</p>
        </div>
        <div class="controller-button-wrapper">
          <i class="icon icon-user-friends"></i>
          <p class="description">我的好友</p>
        </div>
      </ul>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'

    @Component
    export default class extends Vue {
    }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-user-center-controller
    width 100%
    .login-wrapper
      width 80%
      margin 50px auto 40px
      display flex
      align-items center
      .avatar-wrapper
        flex 0 0 40px
        width 48px
        height 48px
        margin-right 12px
        i
          font-size 48px
      .description
        flex 1
        color $color-text-l
        font-size $font-size-median-x
    .controllers-wrapper
      display flex
      justify-content center
      align-items center
      .controller-button-wrapper
        flex 1
        display flex
        flex-direction column
        justify-content center
        text-align center
        color $color-text-ll
        font-size $font-size-median-x
        .icon
          font-size $font-size-large-x
          margin-bottom 8px
</style>
