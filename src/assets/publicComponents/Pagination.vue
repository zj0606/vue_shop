<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="cPage"
    :page-sizes="pSizes"
    :page-size="pSize"
    :layout="layout"
    :total="total">
  </el-pagination>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: {
    cPage: {
      type: Number,
      default: 1
    },
    pSize: {
      type: Number,
      default: 1
    },
    pSizes: {
      type: Array,
      default: () => [1, 3, 5]
    },
    layout: {
      default: 'total, sizes, prev, pager, next, jumper'
    },
    total: {
      type: Number,
      default: 1
    }
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange (val) {
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>
