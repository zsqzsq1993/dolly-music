<template>
    <div class="m-scroll" ref="wrapper">
      <slot></slot>
    </div>
</template>

<script lang="ts">
    import {Prop, Component, Vue} from 'vue-property-decorator'

    @Component
    export default class extends Vue {
      @Prop({default: null}) readonly data!: any
    }
</script>

<style lang="stylus"></style>
