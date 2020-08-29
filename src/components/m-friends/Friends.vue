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
      <scroll class="name-list-scroll" v-show="keyword && this.namelist.length">
        <div class="name-list-wrapper">
          <div class="name-wrapper" v-for="name in namelist" :key="name.username">
            <div class="name">{{name.username}}</div>
            <div class="add-icon-wrapper">
              <i class="icon-user-add"></i>
            </div>
          </div>
        </div>
      </scroll>
      <div class="no-search-result-wrapper" v-show="showNoResults">
        <no-results></no-results>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator'
  import {Getter, Mutation} from 'vuex-class'
  import * as types from 'src/store/mutation-types'
  import NoResults from 'base/m-no-results/NoResults.vue'
  import SearchBox from 'base/m-search-box/SearchBox.vue'
  import {searchUser} from 'src/api/favorite'
  import Scroll from 'base/m-scroll/Scroll.vue'

  @Component({
    components: {
      NoResults,
      SearchBox,
      Scroll
    }
  })
  export default class extends Vue {
    @Getter('loginInfo') loginInfo: any

    @Mutation(types.SET_LOGIN_PAGE_FLAG) setLoginPageFlag: any

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
            padding 0 8px
            margin-bottom 15px
            color $color-text-d
            font-size $font-size-median-x

            .name
              flex 1
              text-align left

            .add-icon-wrapper
              flex 1
              text-align right
      .no-search-result-wrapper
        position absolute
        z-index -1
        top 10px
        right 0
        bottom 0
        left 0
</style>
