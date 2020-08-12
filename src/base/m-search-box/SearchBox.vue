<template>
  <div class="m-search-box">
    <i class="icon-search"></i>
    <input type="text"
           class="input-box"
           v-model="content"
           :placeholder="placeholder">
    <i class="icon-dismiss" v-show="content" @click="clearContent"></i>
  </div>
</template>

<script lang="ts">
  import {Prop, Component, Vue, Watch} from 'vue-property-decorator'

  @Component
  export default class extends Vue {
    @Prop({default: '搜索歌曲、歌手'}) placeholder!: string

    @Watch('content')
    emitQuery(newVal: string) {
      this.$emit('query', newVal)
    }

    content = ''

    clearContent() {
      this.content = ''
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-search-box
    display flex
    align-items center
    box-sizing border-box
    width 100%
    height 40px
    padding 0 6px
    background-color $color-highlight-background
    border-radius 6px

    .icon-search
      font-size 24px
      color $color-background

    .input-box
      flex 1
      margin 0 5px
      line-height 18px
      color $color-text
      background-color $color-highlight-background
      font-size $font-size-median
      outline 0
      &::placeholder
        $color-text-d

    .icon-dismiss
      font-size 16px
      color $color-background
</style>
