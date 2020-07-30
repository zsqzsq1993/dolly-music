<template>
  <div class="m-tab">
    <router-link class="tab-item" tag="div" to="/recommand"><span class="tab-link">推荐</span></router-link>
    <router-link class="tab-item" tag="div" to="/singers"><span class="tab-link">歌手</span></router-link>
    <router-link class="tab-item" tag="div" to="/rank"><span class="tab-link">排行</span></router-link>
    <router-link class="tab-item" tag="div" to="/search"><span class="tab-link">搜索</span></router-link>
  </div>
</template>

<style lang="stylus">
  @import "~assets/stylus/variable.styl"

  .m-tab
    display flex
    height 44px
    line-height 44px
    font-size $font-size-median

    .tab-item
      flex 1 0 auto
      text-align center

      .tab-link
        padding-bottom 5px
        color $color-text-l

      &.router-link-active
        .tab-link
          color $color-theme
          border-bottom 2px solid $color-theme
</style>
