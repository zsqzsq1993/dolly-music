<template>
    <div class="m-header">
      <div class="icon"></div>
      <h1 class="title">Dolly's Music</h1>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'

    @Component({})

    export default class extends Vue {
    }
</script>

<style lang="stylus">
  @import "~assets/stylus/variable.styl"

  .m-header
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
</style>
