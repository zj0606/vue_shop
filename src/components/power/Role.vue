<template>
  <div>
    <Bread :bread="bread" />
    <!-- 内容主体区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template #default="scope">
            <el-row :class="['bdBottom', { 'bdTop': i1 ==0 }]" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag type="primary" closable  @close="deleteRoles(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row :class="{ 'bdTop': i2!=0 }" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="danger" closable  @close="deleteRoles(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限 -->
                    <el-tag type="warning" closable v-for="item3 in item2.children" :key="item3.id" @close="deleteRoles(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="editRoles(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
      title="分配权限"
      :visible.sync="roleDialogVisible"
      width="30%"
      @close="closeLeafRights"
      >
      <el-tree :data="rightsList" ref="role" :props="defaultProps" show-checkbox default-expand-all node-key="id" :default-checked-keys="DefaultCheckRightsList"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmLeafRights">确 定</el-button>
      </span>
    </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Bread from '@/assets/publicComponents/Bread.vue'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      bread: ['权限管理', '角色列表'],
      // 控制权限弹窗显示隐藏
      roleDialogVisible: false,
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点数组
      DefaultCheckRightsList: [],
      // 当前被点击的分配权限的用户id
      id: ''
    }
  },
  components: {
    Bread
  },
  computed: {
    ...mapState('login/roles', [
      'rolesList',
      'rightsList'
    ])
  },
  created () {
    this.rolesListAction()
  },
  methods: {
    ...mapActions('login/roles', [
      'rolesListAction',
      'rightsListAction'
    ]),
    // 获取默认选中的节点
    //  根据递归的方式获取权限列表中 已有的所有节点
    getDefaultCheckRightsPoint (role, arr) {
      // 三级权限
      if (!role.children) {
        return arr.push(role.id)
      }
      role.children.forEach(item => {
        this.getDefaultCheckRightsPoint(item, arr)
      })
    },
    // 分配用户权限 点击
    editRoles (role) {
      this.rightsListAction()
      this.getDefaultCheckRightsPoint(role, this.DefaultCheckRightsList)
      this.id = role.id
      this.roleDialogVisible = true
    },
    // 关闭权限分配对话框
    closeLeafRights () {
      this.DefaultCheckRightsList()
    },
    // 提交分配权限
    async confirmLeafRights () {
      var roles = [
        ...this.$refs.role.getCheckedKeys(),
        ...this.$refs.role.getHalfCheckedKeys()
      ]
      var rids = roles.join(',')
      const { meta } = await this.$post(`roles/${this.id}/rights`, {
        rids: rids
      })
      if (meta.status !== 200) {
        return this.$message.error('提交分配权限失败')
      }
      this.$message.success('提交分配权限成功')
      this.rolesListAction()
      this.roleDialogVisible = false
    },
    // 删除权限
    async deleteRoles (role, id) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }

      const { data, meta } = await this.$delete(`roles/${role.id}/rights/${id}`)
      if (meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      role.children = data
    }
  }
}
</script>
<style lang="less" scoped>
.bdTop {
  border-top: 1px solid #eee;
}
.bdBottom {
  border-bottom: 1px solid #eee;
}
.el-row {
  margin-bottom: 5px;
}
</style>
