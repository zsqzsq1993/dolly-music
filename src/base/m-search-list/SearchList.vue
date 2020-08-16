<template>
    <div class="m-search-list">
      <div class="search-title">
        <h1 class="title-text" v-text="title"></h1>
        <span class="icon-wrapper" @click="clearAll">
          <i class="icon-clear"></i>
        </span>
      </div>
      <ul class="search-list">
        <li class="search-item"
            v-for="item in list"
            :key="item"
            @click="selectOne(item)">
          <p class="text" v-text="item"></p>
          <span class="icon-wrapper" @click.stop="removeOne(item)">
            <i class="icon-delete"></i>
          </span>
        </li>
      </ul>
    </div>
</template>

<script lang="ts">
    import {Prop, Component, Vue} from 'vue-property-decorator'

    @Component
    export default class extends Vue {
      @Prop({default: []}) list!: Array<string>

      @Prop({default: '搜索历史'}) title!: string

      selectOne(item: string) {
        this.$emit('select-one', item)
      }

      removeOne(item: string) {
        this.$emit('remove-one', item)
      }

      clearAll() {
        this.$emit('clear-all')
      }
    }
</script>

<style lang="stylus">
  @import '~assets/stylus/mixin.styl'
  @import '~assets/stylus/variable.styl'

  .m-search-list
    margin 0 20px 20px
    .search-title
      display flex
      align-items center
      height 40px
      .title-text
        flex 1
        color $color-text-l
        font-size $font-size-median
      .icon-wrapper
        extend-click()
        i
          color $color-text-d
          font-size $font-size-median
    .search-item
      display flex
      align-items center
      height 40px
      .text
        flex 1
        color $color-text-l
        font-size $font-size-median-x
      .icon-wrapper
        extend-click()
        i
          color $color-text-d
          font-size $font-size-small
</style>
