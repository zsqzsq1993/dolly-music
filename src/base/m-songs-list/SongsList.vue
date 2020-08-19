<template>
  <div class="m-songs-list">
    <ul>
      <li v-for="(song, index) in songs"
          :key="song.songid"
          class="song-wrapper"
          @click.stop="selectItem(song, index)">
        <div v-if="rank"
             class="rank">
          <span :class="getCls(index)"
                v-text="getText(index)">
          </span>
        </div>
        <div class="song-content">
          <h2 class="song-title">{{song.songname}}</h2>
          <p class="song-desc">{{song.singer}}·{{song.albumname}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import {Prop, Component, Vue} from 'vue-property-decorator'
  import {Song} from 'src/assets/ts/Song'

  @Component
  export default class extends Vue {
    @Prop({default: false}) readonly rank!: boolean
    @Prop({
      default() {
        return []
      }
    }) readonly songs!: Array<undefined | Song>

    selectItem(song: Song, index: number) {
      this.$emit('select', song, index)
    }

    getCls(index: number) {
      return index < 3
        ? `icon icon${index + 1}`
        : 'text'
    }

    getText(index: number) {
      return index > 2
        ? index + 1
        : ''
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'
  @import '~assets/stylus/mixin.styl'

  .m-songs-list
    .song-wrapper
      display flex
      align-items  center
      box-sizing border-box
      height 64px
      font-size $font-size-median
      .rank
        flex 0 0 25px
        width 25px
        margin-right 30px
        text-align center
        .icon
          display inline-block
          width 25px
          height 24px
          background-size 25px 24px
          &.icon1
            bg-img('first')
          &.icon2
            bg-img('second')
          &.icon3
            bg-img('third')
        .text
          color $color-theme
          font-size $font-size-large
      .song-content
        flex 1
        line-height: 20px
        overflow: hidden
        .song-title
          color $color-text
          no-wrap()
        .song-desc
          margin-top 4px
          color $color-text-d
          no-wrap()
</style>
