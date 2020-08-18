<template>
  <ul class="m-switches">
    <li class="tab-button"
        v-for="(tab, idx) in tablist"
        :key="tab"
        :class="{'active': idx === activeIndex }"
        @click.stop="selectItem(idx)">
      <span>{{tab}}</span>
    </li>
  </ul>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from 'vue-property-decorator'

  @Component
  export default class extends Vue {
    @Prop({default: ['0', '1']}) tablist!: Array<string>

    activeIndex = 0

    selectItem(index: number) {
      this.activeIndex = index
      this.$emit('select-item', index)
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-switches
    width 100%
    display flex
    border 1px solid $color-highlight-background
    border-radius 5px

    .tab-button
      flex 1
      padding 8px
      text-align center
      color $color-text-d
      font-size $font-size-median

      &.active
        color $color-text
        background-color $color-highlight-background

</style>
