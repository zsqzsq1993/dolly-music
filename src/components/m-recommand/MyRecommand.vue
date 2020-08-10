<template>
  <div class="m-recommand" ref="recommand">
    <scroll :data="list" class="recommand-scroll" ref="recommandScroll">
      <div>
        <div class="slider-outer-wrapper">
          <div class="slider-inner-wrapper">
            <slider v-if="slider.length">
              <div v-for="item in slider"
                   :key="item.jumpUrl">
                <a :href="item.jumpUrl">
                  <img :src="item.picUrl">
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="list-wrapper">
          <h1 class="title">热门歌单推荐</h1>
          <div class="list-item"
               v-for="(item,idx) in list"
               :key="item.creator.name + idx">
            <div class="img-wrapper">
              <img width="60"
                   height="60"
                   v-lazy="item.imgurl"
                   :alt="item.creator.name">
            </div>
            <div class="text-wrapper">
              <h2 class="sub-title">{{item.creator.name}}</h2>
              <p class="disc">{{item.dissname}}</p>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <div class="loading-wrapper">
      <loading :show="!list.length"></loading>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Mixins} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import {getRecommandCarousel, getRecommandList, SliderData, ListData} from 'src/api/getRecommand'
  import Slider from 'base/m-slider/Slider.vue'
  import Scroll from 'base/m-scroll/Scroll.vue'
  import Loading from 'base/m-loading/Loading.vue'
  import {playListMixin} from 'src/assets/ts/mixins'
  import {Song} from 'src/assets/ts/Song'

  @Component({
    components: {
      Slider,
      Scroll,
      Loading
    }
  })
  export default class extends Mixins(playListMixin) {
    @Getter('playList') readonly playList!: Array<Song>

    slider: Array<undefined | SliderData> = []
    list: Array<undefined | ListData> = []

    created() {
      this._getRecommandCarousel()
      this._getRecommandList()
    }

    handlePlayList() {
      const bottom = this.playList.length ? 60 : 0
      const wrapper = this.$refs.recommand as any
      const scroll = this.$refs.recommandScroll as any
      wrapper.style.bottom = bottom + 'px'
      scroll.refresh()
    }

    _getRecommandCarousel() {
      getRecommandCarousel().then(response => {
        if (response.code === 0) {
          this.slider = response.data
        } else {
          throw new Error('can not catch carousel data.')
        }
      })
    }

    _getRecommandList() {
      getRecommandList().then(response => {
        if (response.code === 0) {
          this.list = response.data
        } else {
          throw new Error('can not catch carousel data.')
        }
      })
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-recommand
    position fixed
    width 100%
    top: 88px
    bottom 0

    .recommand-scroll
      width 100%
      height 100%
      overflow hidden

    .recommand-content
      height 100%
      overflow hidden

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

    .list-wrapper
      .title
        height 65px
        line-height 65px
        text-align center
        font-size $font-size-median
        color: $color-theme

      .list-item
        display flex
        padding 0 20px 20px

        .img-wrapper
          flex 0 0 60px
          padding-right 20px

        .text-wrapper
          display flex
          flex-direction column
          justify-content space-around
          flex 1 1 0
          font-size $font-size-median

          .sub-title
            color $color-text

          .disc
            color $color-text-d

    .loading-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
