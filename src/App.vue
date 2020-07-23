<template>
    <div class="app">
      <my-header></my-header>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'

    import MyHeader from 'components/m-header/MyHeader.vue'

    @Component({
        components: {
          'my-header': MyHeader
        }
    })

    export default class extends Vue {
    }
</script>

<style lang="stylus"></style>
