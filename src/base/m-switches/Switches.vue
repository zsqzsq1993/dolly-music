<template>
    <div class="m-switches">
      <ul>
        <li class="tab-button"
            v-for="(tab, idx) in tablist"
            :key="tab"
            :class="{'active': idx === activeIndex }"
            @click.stop="selectItem(idx)">
          {{tab}}
        </li>
      </ul>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator'

    @Component
    export default class extends Vue {
      @Prop({default: []}) tablist!: Array<string>

      activeIndex = 0

      selectItem(index: number) {
        this.activeIndex = index
        this.$emit('select-item', index)
      }
    }
</script>

<style lang="stylus">
  .m-switches
    width 100%
    display flex
    background-color $color-background
    .tab-button
      flex 1
      padding 8px
      text-align center
      color $color-text-d
      font-size $font-size-median
      border 1px solid $color-text-d
      border-radius 5px
      &.avtive
        color $color-text
        background-color $color-highlight-background

</style>
