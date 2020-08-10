<template>
  <div class="m-rank">
    I am rank
  </div>
</template>

<script lang="ts">
  import {Vue, Component} from 'vue-property-decorator'
  import {getTopList} from 'src/api/getRank'

  @Component
  export default class extends Vue {
    created() {
      this._getRecommandList()
    }

    _getRecommandList() {
      getTopList().then(response => {
        console.log(response)
      }).catch(e => {
        console.log(e)
      })
    }
  }
</script>

<style lang="stylus"></style>
