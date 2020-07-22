<template>
    <div class="app">
      <MyHeader></MyHeader>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'

    import MyHeader from 'components/m-header/MyHeader.vue'

    @Component({
        components: {
          MyHeader
        }
    })

    export default class extends Vue {
    }
</script>

<style lang="stylus"></style>
