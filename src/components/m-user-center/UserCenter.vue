<template>
  <transition name="slide" appear>
    <div class="m-user-center">
    </div>
  </transition>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component
  export default class extends Vue {
  }
</script>

<style lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition all .4s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
  .m-user-center
    position fixed
    top 0
    right 0
    bottom 0
    left 0
</style>
