<template>
  <div>
    <Bread :bread="bread"/>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data="CateList" :columns="columns" :expand-type="false" :selection-type="false"
        show-index
        index-text="#"
      >
        <!-- 是否有效 -->
        <template v-slot:isOk="scope">
          <i v-if="scope.row.cat_deleted===true" style="color: lightGreen;" class="el-icon-success"></i>
          <i v-if="scope.row.cat_deleted===false" style="color: lightGreen;" type="danger" class="el-icon-error"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="danger" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 排序 -->
        <template v-slot:opt>
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10,]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="30%"
      @close="addCateDialogClosed"
      >
      <el-form label-width="100px" class="demo-ruleForm" :model="addCateForm" :rules="addCateRules" ref="addCateFormRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="pCateId"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleChange"
            clearable
            >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Bread from '@/assets/publicComponents/Bread.vue'
export default {
  data () {
    return {
      bread: ['商品管理', '商品分类'],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      //   商品列表数据
      CateList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          minWidth: '200px',
          // 表示 将当前这一类定义为模板列
          type: 'template',
          // 表示 当前这一列使用的模板名称
          template: 'isOk'
        },
        {
          label: '排序',
          prop: 'cat_level',
          // 表示 将当前这一类定义为模板列
          type: 'template',
          // 表示 当前这一列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示 将当前这一类定义为模板列
          type: 'template',
          // 表示 当前这一列使用的模板名称
          template: 'opt'
        }
      ],
      // 控制分类对话框的  显示与隐藏
      addCateDialogVisible: false,
      // 分类表单数据
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级 默认添加的是一级分类
        cat_leave: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类数据
      parentCateList: [],
      // 父级分类id
      pCateId: [],
      // 级联选择器的配置对象
      cascaderProps: { expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children', checkStrictly: true }
    }
  },
  components: { Bread },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: { result, total }, meta } = await this.$get('categories', {
        params: this.queryInfo
      })
      if (meta.status !== 200) {
        return this.$message.error('查询商品信息失败')
      }
      this.CateList = result
      this.total = total
    },
    // 改变每页显示数量
    handleSizeChange (num) {
      this.queryInfo.pagesize = num
      this.getCateList()
    },
    // 当前页面发生改变
    handleCurrentChange (cPage) {
      this.queryInfo.pagenum = cPage
      this.getCateList()
    },
    // 添加分类
    async showAddCate () {
      const { data, meta } = await this.$get('categories', {
        params: { type: 2 }
      })
      if (meta.status !== 200) {
        return this.$message.error('获取父级分类信息失败')
      }
      this.parentCateList = data
      this.addCateDialogVisible = true
    },
    // 级联选择器 change 事件
    handleChange () {
      // 如果选择的父级分类 长度大于零 说明选择父级分类
      // 否则没有选择父级分类
      if (this.pCateId.length > 0) {
        this.addCateForm.cat_pid = this.pCateId[this.pCateId.length - 1]
        this.addCateForm.cat_leave = this.pCateId.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_leave = 0
      }
    },
    //  分类提交
    async addCateSubmit () {
      const { meta } = await this.$post('categories', this.addCateForm)
      if (meta.status !== 201) {
        return this.$message.error('提交失败')
      }
      this.$message.success('提交成功')
      this.getCateList()
      this.addCateDialogVisible = false
    },
    // 关闭分类列表
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.pCateId = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_leave = 0
    }
  }
}
</script>
<style lang="less" scoped>
</style>
