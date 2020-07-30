<template>
    <div class="m-singer-detail">
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'
    import { Getter } from 'vuex-class'

    @Component
    export default class extends Vue {
      @Getter('singer') singer: any

      mounted() {
        console.log(this.singer)
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
