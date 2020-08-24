<template>
  <div class="m-user-center-controller">
    <div class="login-wrapper">
      <div class="avatar-wrapper">
        <i class="icon-user-photo"></i>
      </div>
      <div class="description">登陆立享云端同步</div>
    </div>
    <ul class="controllers-wrapper" @click.stop="selectItem($event)">
      <li class="controller-button-wrapper"
          data-page="favorite"
          :class="getCls('favorite')">
        <i class="icon icon-user-favorite"></i>
        <p class="description">我喜欢的</p>
      </li>
      <li class="controller-button-wrapper"
          data-page="music"
          :class="getCls('music')">
        <i class="icon icon-user-music"></i>
        <p class="description">最近播放</p>
      </li>
      <li class="controller-button-wrapper"
          data-page="friends"
          :class="getCls('friends')">
        <i class="icon icon-user-friends"></i>
        <p class="description">我的关注</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  const map = {
    'favorite': 0,
    'music': 1,
    'friends': 2
  }

  @Component
  export default class extends Vue {
    currentIndex = 0

    selectItem(event: Event) {
      const target = event.target as HTMLElement

      const val = target.dataset.page || target.parentElement.dataset.page

      this.currentIndex = map[val]

      this.$emit('select-item', this.currentIndex)
    }

    getCls(val: string) {
      return map[val] === this.currentIndex ? 'current' : ''
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-user-center-controller
    width 100%

    .login-wrapper
      width 80%
      margin 50px auto 40px
      display flex
      align-items center
      color $color-text-l

      .avatar-wrapper
        flex 0 0 40px
        width 48px
        height 48px
        margin-right 12px

        i
          font-size 48px

      .description
        flex 1
        font-size $font-size-median-x

    .controllers-wrapper
      display flex
      justify-content center
      align-items center

      .controller-button-wrapper
        flex 1
        display flex
        height 48px
        flex-direction column
        justify-content center
        text-align center
        color $color-text-l
        font-size $font-size-median-x

        &.current
          color $color-text-ll

        .icon
          margin-bottom 8px
          font-size $font-size-large-x
</style>
