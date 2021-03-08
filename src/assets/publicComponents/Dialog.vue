<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogV"
    :width="width"
    @close="cancle"
    >
    <slot name="content">内容区域</slot>
    <slot name="footer"></slot>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: {
    title: String,
    dialogshow: Boolean,
    width: {
      type: String,
      default: '800px'
    },
    id: String
  },
  computed: {
    dialogV: {
      get () {
        return this.dialogshow
      },
      set (value) {
        this.cancle()
      }
    }
  },
  methods: {
    cancle () {
      this.$emit('closeAddDialog', this.id)
    }
  }
}
</script>
