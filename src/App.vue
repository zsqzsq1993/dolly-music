<template>
    <div class="app">
      <my-header></my-header>
      <my-tab></my-tab>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import MyHeader from 'components/m-header/MyHeader.vue'
    import MyTab from 'components/m-tab/MyTab.vue'

    @Component({
        components: {
          MyHeader,
          MyTab
        }
    })

    export default class extends Vue {

    }
</script>

<style lang="stylus"></style>
