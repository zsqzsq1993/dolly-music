<template>
  <scroll :data="data" ref="scroll"
          class="scroll"
          :prob-type="3">
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
    </div>
    <div class="list-shortcut">
      <ul @touchstart="handleTouchStart"
          @touchmove="handleTouchMove">
        <li v-for="(item, idx) in data"
            :key="item.title + idx"
            class="shortcut-item"
            :class="{ 'current' : idx === currentIndex }"
            :data-index="idx"
            ref="shortcuts">
          {{ item.title.slice(0, 1) }}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script lang="ts">
    import {Prop, Component, Vue, Watch} from 'vue-property-decorator'
    import { SingerInstance } from 'src/assets/ts/Singer'
    import Scroll from 'base/m-scroll/Scroll.vue'
    import { getData } from 'src/assets/ts/dom'

    const SHORTCUT_HEIGHT = 22

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

      shortcutRange = {
        firstTop: 0,
        lastTop: 0
      }

      touch = {
        y1: 0,
        y2: 0,
        anchorIndex: 0
      }

      @Watch('data')
      whenDataChange() {
        this._initShortcutRange()
      }

      @Watch('currentIndex')
      shouldScroll() {
        this._scrollToElement(this.$refs.groups as Element[], this.currentIndex)
      }

      mounted() {
        setTimeout(() => {
          this._initShortcutRange()
        }, 100)
      }

      handleTouchStart(event: TouchEvent) {
        const target = event.target as HTMLElement
        const index: number = parseInt(getData(target, 'index'))
        this.currentIndex = this.touch.anchorIndex = index
        this.touch.y1 = this.shortcutRange.firstTop + index * SHORTCUT_HEIGHT
      }

      handleTouchMove(event: TouchEvent) {
        const y2 = (this.touch.y2 = event.touches[0].clientY)
        if (y2 >= this.shortcutRange.firstTop &&
            y2 <= this.shortcutRange.lastTop + SHORTCUT_HEIGHT) {
          const delta = this.touch.y2 - this.touch.y1
          const deltaIndex = (delta / SHORTCUT_HEIGHT) | 0
          this.currentIndex = this.touch.anchorIndex + deltaIndex
        }
      }

      _scrollToElement(elements: Element[], index: number) {
        this.$refs.scroll && (this.$refs.scroll as any).scrollToElement(elements[index], 0)
      }

      _initShortcutRange() {
        const shortcuts: Element[] = this.$refs.shortcuts as Element[]
        if (shortcuts) {
          const len = shortcuts.length
          this.shortcutRange.firstTop = shortcuts[0].getBoundingClientRect().top
          this.shortcutRange.lastTop = shortcuts[len - 1].getBoundingClientRect().top
          console.log(this.shortcutRange)
        }
      }
    }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'
  .scroll
    position relative
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
