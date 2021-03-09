<template>
  <div>
    <Bread :bread="bread"/>
    <el-card>
      <el-alert
        title="注意：只允许选择三级分类设置操作"
        type="warning"
        :closable="true"
        show-icon
        >
      </el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="cateId"
            clearable
            :options="cateList"
            :props="cateProps"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isAble">添加参数</el-button>
          <Table :data="manyCateData" :label="'动态参数'">
            <template v-slot:expand></template>
            <template v-slot:opt>
              <el-button type="parimary" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete">删除</el-button>
            </template>
          </Table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isAble">添加属性</el-button>
          <Table :data="onlyCateData" :label="'静态属性'">
            <template v-slot:expand></template>
            <template v-slot:opt>
              <el-button type="parimary" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete">删除</el-button>
            </template>
          </Table>
        </el-tab-pane>
    </el-tabs>
    </el-card>
  </div>
</template>
<script>
import Bread from '@/assets/publicComponents/Bread.vue'
import Table from './Table.vue'
export default {
  data () {
    return {
      bread: ['商品管理', '分类参数'],
      //   商品分类信息数据
      cateList: [],
      //   选择的分类id
      cateId: [],
      //   商品分类属性配置
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //   默认激活的 tab
      activeName: 'many',
      //   静态参数数据
      onlyCateData: [],
      //   动态参数数据
      manyCateData: []
    }
  },
  components: {
    Bread, Table
  },
  computed: {
    // 通过计算属性 控制 添加属性 添加参数按钮的  是否禁用
    isAble () {
      return this.cateId.length !== 3
    },
    //   获取商品分类id
    getCateId () {
      if (this.cateId.length === 3) {
        return this.cateId[this.cateId.length - 1]
      }
      return null
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data, meta } = await this.$get('categories', {
        params: { type: 3 }
      })
      if (meta.status !== 200) {
        return this.$message.error('请求商品分类信息失败')
      }
      this.cateList = data
    },
    //  分类数据 变化
    handleChange () {
      this.getCateListData()
    },
    //  切换tab
    handleClick () {
      this.getCateListData()
    },
    async getCateListData () {
      if (this.cateId.length !== 3) {
        this.cateId = []
        return
      }
      const { data, meta } = await this.$post(`categories/${this.getCateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (meta.status !== 200) {
        return this.$message.error('查询参数列表失败')
      }
      if (this.activeName === 'only') {
        this.onlyCateData = data
      } else {
        this.manyCateData = data
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
