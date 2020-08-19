<template>
  <transition name="slide" appear>
    <div class="m-user-center" @click="back">
      <div class="back-wrapper">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :tablist="tablist"
                  @select-item="setCurrentIndex"></switches>
      </div>
      <div class="random-play-wrapper">
        <div class="random-play-button">
          <i class="icon-play"></i>
          <span>随机播放全部</span>
        </div>
      </div>
      <Scroll>
        <songs-list></songs-list>
      </Scroll>
    </div>
  </transition>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import Switches from 'base/m-switches/Switches.vue'
  import Scroll from 'base/m-scroll/Scroll.vue'
  import SongsList from 'base/m-songs-list/SongsList.vue'

  @Component({
    components: {
      Switches,
      Scroll,
      SongsList
    }
  })
  export default class extends Vue {
    tablist = ['我喜欢的', '最近听的']
    currentIndex = 0

    back() {
      this.$router.push('/')
    }

    setCurrentIndex(index: number) {
      this.currentIndex = index
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .slide-enter-active, .slide-leave-active
    transition all .4s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
  .m-user-center
    position fixed
    z-index 1000
    top 0
    right 0
    bottom 0
    left 0
    background-color $color-background

    .back-wrapper
      position absolute
      top 0
      left 6px
      i
        display block
        padding 10px
        color $color-theme
        font-size $font-size-large-x

    .switches-wrapper
      margin 10px 0 30px
      .m-switches
        margin 0 auto
        width 240px

    .random-play-wrapper
      .random-play-button
        margin 0 auto
        box-sizing border-box
        width 135px
        padding 7px 0
        display flex
        align-items center
        justify-content center
        border 1px solid $color-text-l
        border-radius 100px
        color $color-text-l
        font-size 0
        i
          flex: 0 0 auto
          margin-right 6px
          font-size $font-size-median-x
        span
          flex: 0 0 auto
          font-size $font-size-small
</style>
