<template>
  <div class="m-user-center-controller">
    <div class="login-wrapper" @click.stop="setLoginPageFlag(true)">
      <div class="avatar-wrapper">
        <i class="icon-user-photo"></i>
      </div>
      <div class="description" v-text="username"></div>
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
  import {Mutation, Getter} from 'vuex-class'
  import * as types from 'src/store/mutation-types'

  const map = {
    'favorite': 0,
    'music': 1,
    'friends': 2
  }

  @Component
  export default class extends Vue {
    @Mutation(types.SET_LOGIN_PAGE_FLAG) setLoginPageFlag: any

    @Getter('loginInfo') loginInfo: any

    currentIndex = 0

    get username() {
      if (this.loginInfo.status) {
        return this.loginInfo.username
      } else {
        return '登陆立享云端同步'
      }
    }

    selectItem(event: Event) {
      const target = event.target as HTMLElement

      const val = (target.dataset.page || target.parentElement!.dataset.page) as string

      this.currentIndex = (map as any)[val]

      this.$emit('select-item', this.currentIndex)
    }

    getCls(val: string) {
      return (map as any)[val] === this.currentIndex ? 'current' : ''
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-user-center-controller
    width 100%

    .login-wrapper
      width 80%
      margin 50px auto 20px
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
