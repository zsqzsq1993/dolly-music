<template>
    <div class="m-recommand">
      <div class="slider-outer-wrapper">
        <div class="slider-inner-wrapper">
          <slider
            v-if="slider.length"
            :momentum="true">
            <a v-for="(item, idx) in slider"
               :key="idx"
               :href="item.jumpUrl">
              <img :src="item.picUrl">
            </a>
          </slider>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import getRecommandCarousel from 'src/api/getRecommandCarousel'
    import Slider from '@/base/Slider.vue'

    @Component({
        components: {
          Slider
        }
    })

    export default class extends Vue {
      slider = []

      created() {
        this._getRecommandCarousel()
      }

      _getRecommandCarousel() {
        getRecommandCarousel().then(response => {
          if (response.code === 0) {
            this.slider = response.data.slider
          } else {
            throw new Error('can not catch carousel data.')
          }
        })
      }
    }
</script>

<style lang="stylus">
  .m-recommand
    .slider-outer-wrapper
      position relative
      width 100%
      padding-top 40%
      background red
        overflow hidden
      .slider-inner-wrapper
        position absolute
        top 0
        left 0
        width 100%
        height 100%
</style>
