<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="title">Dolly's Music</h1>
    <router-link class="user-center-icon"
                 to="/user"
                 tag="div">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<style lang="stylus">
  @import "~assets/stylus/variable.styl"

  .m-header
    position relative
    height 44px
    text-align center
    color $color-theme
    font-size 0

    .icon
      display inline-block
      margin 6px 9px 0 0
      width 30px
      height 32px
      background url("pizza.png")
      background-size 30px 32px

    .title
      display inline-block
      vertical-align top
      line-height 44px
      font-size $font-size-large

    .user-center-icon
      position absolute
      top 0
      right 0
      i
        display block
        padding 12px
        font-size 20px
        color $color-theme
</style>
