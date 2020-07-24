<template>
    <div class="m-recommand">

    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import getRecommandCarousel from 'src/api/getRecommandCarousel'

    @Component({
        props: {},

        components: {}
    })

    export default class extends Vue {
      slider = []

      mounted() {
        getRecommandCarousel().then(response => {
          if (response.code === 0) {
            this.slider = response.data.slider
          } else {
            throw new Error('can not catch carousel data.')
          }
        })
      }
    }
</script>

<style lang="stylus"></style>
