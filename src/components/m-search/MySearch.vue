<template>
  <div class="m-search">
    <div class="search-box-wrapper">
      <search-box></search-box>
    </div>
    <ul class="hots-wrapper">
      <li v-for="hot in hots"
          :key="hot.n"
          v-text="hot.k"></li>
    </ul>
  </div>
</template>

<script lang="ts">
  import {Vue, Component} from 'vue-property-decorator'
  import {getHotSearch} from 'src/api/getSearch'
  import SearchBox from 'base/m-search-box/SearchBox.vue'

  interface HotKey {
    k: string;
    n: number;
  }

  @Component({
    components: {
      SearchBox
    }
  })
  export default class extends Vue {
    hots: Array<HotKey> = []

    created() {
      this.getHots().then((response: Array<HotKey>) => {
        this.hots = response
        console.log(response)
      })
    }

    getHots(): Promise<Array<HotKey>> {
      return getHotSearch().then((response: any) => {
        if (response.code === 0) {
          return response.data.hotkey
        } else {
          throw new Error('can not get hot search data.')
        }
      })
    }
  }
</script>

<style lang="stylus">
  .m-search
    .search-box-wrapper
      margin 20px
</style>
