<template>
    <div class="m-slider" ref="sliderWrapper">
      <div class="slider-group" ref="sliderList">
        <slot></slot>
      </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'

    @Component({
        props: {},

        components: {}
    })

    export default class extends Vue {
      mounted() {
        this.$nextTick(() => {
          this._setInitialWidth()
        })
      }

      _setInitialWidth() {
        const sliderWrapper: HTMLElement = this.$refs.sliderWrapper as HTMLElement
        const sliderList: HTMLElement = this.$refs.sliderList as HTMLElement
        const unitWidth: number = sliderWrapper.clientWidth
        let totalWidth = 0

        for (let i = 0, len = sliderList.children.length; i < len; i++) {
          const child: HTMLElement = sliderList.children[i] as HTMLElement
          child.style.width = unitWidth + 'px'
          totalWidth += unitWidth
        }

        sliderList.style.width = totalWidth + 'px'
      }
    }
</script>

<style lang="stylus">
  .m-slider
    width 100%
    height 100%
    .slider-group
      height 100%
      display flex
      a
        width 100%
        img
          width 100%
</style>
