<template>
  <Index></Index>
</template>

<script setup>
import { provide } from 'vue';
import * as echarts from 'echarts';
import Index from './views/Index.vue';
import axios from 'axios';

// 利用provide() 让echarts 全局引入
//provide()的使用方法 provide("名字随便起","传递的内容")
provide('echarts', echarts);

provide('axios',axios)
</script>

<style lang="scss">
body {
  background: url('@/assets/img/bg.jpg') top center no-repeat;
}
</style>
