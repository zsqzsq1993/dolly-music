<template>
    <div class="m-no-results">
      <div class="image-wrapper">
        <img src="./pizza.png" :alt="text">
      </div>
      <div class="text-wrapper" v-text="text"></div>
    </div>
</template>

<script lang="ts">
    import {Prop, Component, Vue} from 'vue-property-decorator'

    @Component
    export default class extends Vue {
      @Prop({default: '暂未搜索到结果'}) text!: string
    }
</script>

<style lang="stylus">
  .m-no-results
    display flex
    flex-direction column
    justify-content center
    align-items center
    width 100%
    height 100%
    .image-wrapper
      img
        width 86px
        height 90px
    .text-wrapper
      font-size: $font-size-medium
      color: $color-text-d
</style>
