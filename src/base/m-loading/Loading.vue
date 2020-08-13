<template>
  <div class="m-loading" v-if="show">
    <img
      src="./loading.gif"
      alt="loading image"
      width="32"
      height="32">
    <div class="desc">{{text}}</div>
  </div>
</template>

<script lang="ts">
  import {Vue, Prop, Component} from 'vue-property-decorator'

  @Component
  export default class extends Vue {
    @Prop({default: 'Loading...'}) readonly text!: string
    @Prop({default: true}) readonly show!: boolean
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-loading
    width 100%
    text-align center

    .desc
      line-height: 20px
      font-size: $font-size-small
      color: $color-text-l
</style>
