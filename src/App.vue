<template>
  <div class="app">
    <my-header></my-header>
    <my-tab></my-tab>
    <my-player></my-player>
    <my-login></my-login>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script lang="ts">
  import {Vue, Component} from 'vue-property-decorator'
  import {Action, Getter} from 'vuex-class'
  import MyHeader from 'components/m-header/MyHeader.vue'
  import MyTab from 'components/m-tab/MyTab.vue'
  import MyPlayer from 'src/components/m-player/MyPlayer.vue'
  import MyLogin from 'components/m-login/MyLogin.vue'
  import {uploadFavorite} from 'src/api/favorite'

  @Component({
    components: {
      MyHeader,
      MyTab,
      MyPlayer,
      MyLogin
    }
  })

  export default class extends Vue {
    @Action('refreshLoginInfo') refreshLoginInfo: any

    @Getter('favoriteHistory') favoriteHistory: any

    created() {
      this.refreshLoginInfo()
      this.uploadingSongs()
    }

    uploadingSongs() {
      uploadFavorite(this.favoriteHistory)
    }
  }
</script>

<style lang="stylus"></style>
