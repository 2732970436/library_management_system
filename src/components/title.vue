<template>
<div class="title">
  {{title}}
</div>
</template>
<script lang="ts" setup>
  defineProps({
  title: {
    type:String,
    default:"Library Management System"
  }
})
 
</script>
<style scoped>
  .title {
    text-align: center;
    line-height: 50px;
    width: 100vw;
    height: 50px;
    background-color: aqua;
  }
</style>
   