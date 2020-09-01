<template>
  <div class="m-name-list">
    <div class="name-wrapper" v-for="person in namelist" :key="person.username">
      <div class="name">{{person.username}}</div>
      <div class="songs-count-wrapper">{{person.songs.length}}首收藏</div>
      <div class="follow-wrapper">
        <div v-show="!followed(person.username)"
             @click="followPerson(person.username)">
          Follow
        </div>
        <div v-show="followed(person.username)"
             @click="unfollowPerson(person.username)">
          Following
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Prop, Component, Mixins} from 'vue-property-decorator'
  import {Mutation} from 'vuex-class'
  import * as types from 'src/store/mutation-types'
  import {FriendMixin} from 'src/assets/ts/mixins'

  @Component
  export default class extends Mixins(FriendMixin) {
    @Prop({default: []}) namelist!: Array<any>

    @Mutation(types.SET_LOGIN_PAGE_FLAG) setLoginPageFlag: any

    followed(username: string) {
      return this.loginInfo.friends.indexOf(username) !== -1
    }
  }
</script>

<style lang="stylus"></style>
