<template>
  <div>
    <Bread :bread="bread" />
    <el-card class="box-card">
      <el-table :data="rightsListGetter">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template v-slot:default="scope">
            <el-tag v-if="scope.row.level == 0">一级权限</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="success">二级权限</el-tag>
            <el-tag v-else-if="scope.row.level == 2" type="danger">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import Bread from '@/assets/publicComponents/Bread.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      bread: ['权限管理', '权限列表']
    }
  },
  computed: {
    ...mapGetters('login/rights', [
      'rightsListGetter'
    ])
  },
  components: { Bread },
  created () {
    this.rightsListAction()
  },
  methods: {
    ...mapActions('login/rights', [
      'rightsListAction'
    ])
  }
}
</script>
<style lang="less" scoped>
</style>
