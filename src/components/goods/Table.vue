<template>
  <el-table :data="data" border stripe>
    <el-table-column type="expand">
      <slot name="expand"></slot>
    </el-table-column>
    <el-table-column type="index" label="#"></el-table-column>
    <el-table-column prop="attr_name" :label="label"></el-table-column>
    <el-table-column label="操作">
      <slot name="opt"></slot>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: ['data', 'label']
}
</script>
