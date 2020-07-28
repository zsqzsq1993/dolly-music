<template>
  <scroll :data="data" ref="scroll" class="scroll">
    <div class="m-list-view">
      <ul>
        <li v-for="group in data"
            :key="group.title"
            class="list-group"
            ref="groups">
          <h2 class="list-group-title">{{ group.title }}</h2>
          <ul class="singers-in-group">
            <li class="singer-wrapper"
                v-for="singer in group.items"
                :key="singer.id">
              <img class="avatar"
                   v-lazy="singer.avatar"
                   :alt="singer.name">
              <span class="name">{{singer.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="list-shortcut">
        <ul @touchstart="handleTouchStart">
          <li v-for="(item, idx) in data"
              :key="item.title + idx"
              class="shortcut-item"
              :class="{ current: idx === currentIndex }"
              :data-index="idx">
            {{ item.title.slice(0, 1) }}
          </li>
        </ul>
      </div>
    </div>
  </scroll>
</template>

<script lang="ts">
    import {Prop, Component, Vue} from 'vue-property-decorator'
    import { SingerInstance } from 'src/assets/ts/Singer'
    import Scroll from 'base/m-scroll/Scroll.vue'
    import { getData } from 'src/assets/ts/dom'

    interface Data {
      title: string;
      items: Array<SingerInstance>;
    }

    @Component({
      components: {
        Scroll
      }
    })
    export default class extends Vue {
      @Prop({default: []}) readonly data!: Array<Data>

      currentIndex = 0

      handleTouchStart(event: TouchEvent) {
        const target: HTMLElement = event.target as HTMLElement
        const index: number = getData(target, 'index')
        const element: HTMLElement = (this.$refs.groups as any)[index]
        this._scrollToElement(element)
      }

      _scrollToElement(element: HTMLElement) {
        this.$refs.scroll && (this.$refs.scroll as any).scrollToElement(element)
      }
    }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'
  .scroll
    position: relative;
  .m-list-view
    width 100%
    overflow hidden
    .list-group
      padding-bottom 30px
      .list-group-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background $color-highlight-background
      .singer-wrapper
        display flex
        align-items center
        padding 20px 0 0 30px
        .avatar
          width 50px
          height 50px
          border-radius 50%
        .name
          margin-left 20px
          color $color-text-l
          font-size $font-size-median
    .list-shortcut
      z-index 30
      position absolute
      top 50%
      right 0
      transform translateY(-50%)
      width 20px
      padding 20px 0
      border-radius 10px
      background $color-background-d
      font-family Helvetica
      .shortcut-item
        padding 5px 3px
        text-align center
        font-size $font-size-small
        color $color-text-l
        &.current
          color $color-theme
</style>
