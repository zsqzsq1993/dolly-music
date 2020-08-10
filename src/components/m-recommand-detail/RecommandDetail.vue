<template>
  <slide-transition>
    <music-list
      :title="diss.dissname"
      :avatar="diss.imgurl"
      :songs="{}"></music-list>
  </slide-transition>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import MusicList from 'src/components/m-music-list/MusicList.vue'
  import SlideTransition from 'base/m-transition/SlideTransition.vue'

  @Component({
    components: {
      MusicList,
      SlideTransition
    }
  })
  export default class extends Vue {
    @Getter('diss') readonly diss!: any
  }
</script>
