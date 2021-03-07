<template>
  <div>
    <Bread :bread="bread" />
    <!-- 内容主题区域 -->
    <el-card class="box-card">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="searchTab" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchTab"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <el-table :data="data" border stripe>
        <el-table-column type="index" :index="1"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot:default="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeSwitch(scope.row)"
              >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="edit(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteUserInfo(scope.row.id)"></el-button>
            <!-- 分配权限 -->
            <el-tooltip :enterable="false" effect="dark" content="分配权限" placement="top">
              <el-button type="warning" size="mini" icon="el-icon-setting" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 6]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <Dialog
      :title="'添加用户'"
      :dialogshow="dialogVisible"
      :width="'600px'"
      @closeAddDialog="hiddenDialog"
      :id="'add'"
    >
      <template v-slot:content>
        <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="80px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="userForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="userForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="hiddenDialog('add')">取 消</el-button>
          <el-button type="primary" @click="confirmUser">确 定</el-button>
        </span>
      </template>
    </Dialog>
    <!-- 编辑用户信息弹窗 -->
    <Dialog
      :title="'修改用户信息'"
      :dialogshow="editDialogVisible"
      @closeAddDialog="hiddenDialog"
      :id="'edit'"
    >
      <template v-slot:content>
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px" class="demo-ruleForm">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="hiddenDialog('edit')">取 消</el-button>
          <el-button type="primary" @click="confirmEditDialog">确 定</el-button>
        </span>
      </template>
    </Dialog>
  </div>
</template>
<script>
import Bread from '@/assets/publicCompents/Bread.vue'
import Dialog from '@/assets/publicCompents/Dialog.vue'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    var mobileRule = (rule, value, cb) => {
      var regExp = /^1[0-9]{10}/gi
      if (regExp.test(value)) {
        cb()
      } else {
        cb(new Error('请输入正确的11位手机号'))
      }
    }
    return {
      bread: ['用户管理', '用户列表'],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      //  控制弹窗显示隐藏
      dialogVisible: false,
      //  添加新用户的信息
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //  编辑用户信息
      editDialogVisible: false,
      //  编辑用户信息
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入正确的邮箱', trriger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入正确的手机号', trriger: 'blur' },
          { validator: mobileRule, trriger: 'blur' }
        ]
      },
      userFormRules: {
        username: [
          { required: true, message: '请输入用户名', trriger: 'blur' },
          { min: 3, max: 6, message: '长度为3到6位', trriger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trriger: 'blur' },
          { min: 6, max: 10, message: '长度为6到10位', trriger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入正确的邮箱', trriger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入正确的手机号', trriger: 'blur' },
          { validator: mobileRule, trriger: 'blur' }
        ]
      }
    }
  },
  components: { Bread, Dialog },
  computed: {
    ...mapState('login/users', {
      data: state => state.usersData,
      total: state => state.total
    })
  },
  methods: {
    //  添加用户
    addUser () {
      this.dialogVisible = true
    },
    //  取消弹窗事件
    hiddenDialog (id) {
      if (id === 'add') {
        this.$refs.userFormRef.resetFields()
        this.dialogVisible = false
      } else if (id === 'edit') {
        this.$refs.editFormRef.resetFields()
        this.editDialogVisible = false
      }
    },
    //  提交添加用户数据
    confirmUser () {
      this.$refs.userFormRef.validate(async valid => {
        if (!valid) return
        const { meta } = await this.$post('users', this.userForm)
        if (meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.hiddenDialog('add')
        this.getUser()
      })
    },
    searchTab () {
      this.getUser()
    },
    handleSizeChange (pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getUser()
    },
    handleCurrentChange (cPage) {
      this.queryInfo.pagenum = cPage
      this.getUser()
    },
    async changeSwitch (info) {
      const { meta } = await this.$put(`users/${info.id}/state/${info.mg_state}`)
      if (meta.status === 200) {
        this.$message.success('修改成功')
      } else {
        this.$message.error('修改失败')
        info.mg_state = !info.mg_state
      }
    },
    async getUser () {
      const { data, meta } = await this.$get('users', {
        params: this.queryInfo
      })
      if (meta.status === 200) {
        this.editUsersDataAction(data.users)
        this.editTotalAction(data.total)
      } else {
        this.$message.error('查询用户信息列表失败')
      }
    },
    ...mapActions('login/users', [
      'editUsersDataAction',
      'editTotalAction'
    ]),
    //  编辑用户信息
    async edit (id) {
      const { data, meta } = await this.$get(`users/${id}`)
      if (meta.status === 200) {
        this.editForm = data
      }
      this.editDialogVisible = true
    },
    //  提交修改的用户信息
    confirmEditDialog () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { meta } = await this.$put(`users/${this.editForm.id}`, this.editForm)
        if (meta.status === 200) {
          this.$message.success('编辑用户信息提交成功')
          this.getUser()
          this.hiddenDialog('edit')
        } else {
          this.$message.error('编辑用户信息提交失败')
        }
      })
    },
    //  删除用户信息
    async deleteUserInfo (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
      const { meta } = await this.$delete(`users/${id}`)
      if (meta.status === 200) {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getUser()
      }
    }
  },
  created () {
    this.getUser()
  }
}
</script>
<style lang="less" scoped>
.dialog-footer {
  text-align: end;
  display: block;
}
</style>
