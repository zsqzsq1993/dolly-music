<template>
  <transition name="slide" appear>
    <slot></slot>
  </transition>
</template>

<style lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition all .3s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
