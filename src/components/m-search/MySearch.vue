<template>
  <div class="m-search">
    bbb
  </div>
</template>

<script lang="ts">
  import {Vue, Component} from 'vue-property-decorator'
  import {getHotSearch} from 'src/api/getSearch'

  interface HotKey {
    k: string;
    n: number;
  }

  @Component
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

<style lang="stylus"></style>
