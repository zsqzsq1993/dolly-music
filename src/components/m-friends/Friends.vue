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
            @query="searchUser"></search-box>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import {Getter, Mutation} from 'vuex-class'
    import * as types from 'src/store/mutation-types'
    import NoResults from 'base/m-no-results/NoResults.vue'
    import SearchBox from 'base/m-search-box/SearchBox.vue'

    @Component({
      components: {
        NoResults,
        SearchBox
      }
    })
    export default class extends Vue {
      @Getter('loginInfo') loginInfo: any

      @Mutation(types.SET_LOGIN_PAGE_FLAG) setLoginPageFlag: any

      searchBoxPlaceHolder = '搜索用户名'

      get alreadyLogin() {
        return this.loginInfo.status
      }

      login() {
        this.setLoginPageFlag(true)
      }

      searchUser(val: string) {
        console.log(val)
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
        margin 0 20px
</style>
