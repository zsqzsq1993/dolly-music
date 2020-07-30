<template>
  <div class="m-singer-detail">
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import {getSingerDetail} from 'src/api/getSingers'

  @Component
  export default class extends Vue {
    @Getter('singer') singer: any

    created() {
      this._getSingerDetail(this.singer.id)
    }

    _getSingerDetail(id: string) {
      if (!id) {
        this.$router.push({path: '/singers'})
      }
      getSingerDetail(id).then(response => {
        if (response.code === 0) {
          console.log(response.data.list)
        }
      })
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-singer-detail
    position fixed
    z-index 100
    top 0
    right 0
    bottom 0
    left 0
    background $color-background
</style>
