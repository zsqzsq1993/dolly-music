<template>
    <div class="m-list-view">
      <ul>
        <li v-for="group in data"
            :key="group.title"
            class="list-group">
          <h2 class="list-group-title">{{ group.title }}</h2>
          <ul class="singers-in-group">
            <li class="singer-wrapper"
                v-for="singer in group.items"
                :key="singer.id">
              <img class="avatar"
                   v-lazy="singer.avatar"
                   :alt="singer.name">
              <span class="name">{{singer.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
</template>

<script lang="ts">
    import {Prop, Component, Vue} from 'vue-property-decorator'
    import { SingerInstance } from 'src/assets/ts/Singer'

    interface Data {
      title: string;
      items: Array<SingerInstance>;
    }

    @Component
    export default class extends Vue {
      @Prop({default: []}) readonly data!: Array<Data>
    }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-list-view
    width 100%
    overflow hidden
    .list-group
      padding-bottom 30px
      .list-group-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background $color-highlight-background
      .singer-wrapper
        display flex
        align-items center
        padding 20px 0 0 30px
        .avatar
          width 50px
          height 50px
          border-radius 50%
        .name
          margin-left 20px
          color $color-text-l
          font-size $font-size-median
</style>
