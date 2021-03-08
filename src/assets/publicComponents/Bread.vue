<template>
<!-- 面包屑 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in bread" :key="index">{{ item }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  props: ['bread']
}
</script>
