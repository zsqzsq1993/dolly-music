<template>
  <div class="m-friends">
    <div class="no-login-wrapper" v-show="!alreadyLogin">
      <no-results :text="''">
        <div class="text-wrapper" @click="login">
          请<span class="strong">登陆</span>后查看
        </div>
      </no-results>
    </div>
    <div class="already-login-wrapper" v-show="alreadyLogin">
      <div class="search-box-wrapper">
        <search-box
          :placeholder="searchBoxPlaceHolder"
          @query="handleQuery"></search-box>
      </div>
      <div class="suggest-wrapper" v-show="keyword">
        <scroll class="name-list-scroll" v-show="this.namelist.length" :data="namelist">
          <div class="name-list-wrapper">
            <name-list :namelist="namelist"></name-list>
          </div>
        </scroll>
        <div class="no-search-result-wrapper" v-show="showNoResults">
          <no-results></no-results>
        </div>
      </div>
      <div class="my-follow-wrapper" v-show="!keyword">
        <div class="friend-wrapper"
             v-for="friend in loginInfo.friends"
             :key="friend"
             @click.stop="toFriendDetail(friend)">
          <span class="username">{{friend}}</span>
          <i class="icon-dismiss unfollow-icon" @click.stop="unfollowPerson(friend)"></i>
        </div>
      </div>
      <router-view @no-songs="handleNoSongs"></router-view>
    </div>
    <div class="top-tip-wrapper">
      <top-tip ref="toptip">
        <div class="reminder">
          <i class="icon-delete"></i>
          <span class="text-wrapper">
              该用户尚无歌单
          </span>
        </div>
      </top-tip>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Mixins, Watch} from 'vue-property-decorator'
  import {Mutation} from 'vuex-class'
  import * as types from 'src/store/mutation-types'
  import NoResults from 'base/m-no-results/NoResults.vue'
  import SearchBox from 'base/m-search-box/SearchBox.vue'
  import {searchUser} from 'src/api/favorite'
  import Scroll from 'base/m-scroll/Scroll.vue'
  import NameList from './NameList.vue'
  import {FriendMixin} from 'src/assets/ts/mixins'
  import TopTip from 'base/m-top-tip/TopTip.vue'

  @Component({
    components: {
      NoResults,
      SearchBox,
      Scroll,
      NameList,
      TopTip
    }
  })
  export default class extends Mixins(FriendMixin) {
    @Mutation(types.SET_LOGIN_PAGE_FLAG) setLoginPageFlag: any
    @Mutation(types.SET_FRIEND_USER_NAME) setFriendUsername: any

    @Watch('keyword')
    searchUser(newVal: string, oldVal: string) {
      this.showNoResults = false

      if (!newVal) {
        this.namelist = []
        return
      }
      if (newVal === oldVal) return
      if (this.timer) {
        clearTimeout(this.timer)
      }

      this.timer = setTimeout(() => {
        this.timer = 0

        searchUser(newVal).then(response => {
          this.namelist = response.data

          this.showNoResults =
            this.keyword !== '' &&
            response.data.length === 0
        })
      }, 500)
    }

    searchBoxPlaceHolder = '搜索用户名'
    namelist = []
    keyword = ''
    timer = 0
    showNoResults = false

    get alreadyLogin() {
      return this.loginInfo.status
    }

    login() {
      this.setLoginPageFlag(true)
    }

    handleQuery(val: string) {
      this.keyword = val
    }

    toFriendDetail(name: string) {
      this.setFriendUsername(name)
      this.$router.push(`/user/${name}`)
    }

    handleNoSongs() {
      (this.$refs.toptip as any).show()
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-friends
    width 100%
    height 100%

    .no-login-wrapper
      width 100%
      height 100%

      .text-wrapper
        font-size $font-size-medium
        color $color-text-d

        .strong
          color $color-text-ll

    .already-login-wrapper
      .search-box-wrapper
        margin 0 20px 10px

      .name-list-scroll
        position absolute
        top 50px
        right 0
        bottom 0
        left 0

        .name-list-wrapper
          padding 10px 20px

          .name-wrapper
            display flex
            align-items center
            padding 0 8px
            margin-bottom 15px
            color $color-text-d

            .name
              flex 1
              text-align left
              font-size $font-size-median-x

            .songs-count-wrapper
              flex 1
              text-align right
              font-size $font-size-small

            .follow-wrapper
              flex 1
              text-align right
              font-size $font-size-small

      .no-search-result-wrapper
        position absolute
        z-index -1
        top 10px
        right 0
        bottom 0
        left 0
      .my-follow-wrapper
        padding 10px 20px
        display flex

        .friend-wrapper
          flex 0 0 auto
          display inline-block
          margin 0 10px 10px 0
          padding 5px 10px
          border 1px solid $color-text-d
          border-radius  10px
          color $color-text-d
          font-size $font-size-median

          .username
            margin-right 5px
    .top-tip-wrapper
      position fixed
      z-index 10
      top 0
      left 0
      width 100%

      .reminder
        padding 18px 0
        text-align center

        i
          color $color-theme
          font-size $font-size-median
          margin-right 4px

        span
          color $color-text
          font-size $font-size-median
</style>
