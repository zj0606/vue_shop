<template>
  <div>
    <Bread :bread="bread" />
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="clearIpt">
            <el-button slot="append" icon="el-icon-search" @click="queryData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间">
          <template #default="scope">
            {{ scope.row.add_time | createTimeFormate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteGoodsById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :cPage="queryInfo.pagenum"
        :pSizes="pSizes"
        :pSize="queryInfo.pagesize"
        :total="total"
      />
    </el-card>
  </div>
</template>
<script>
import Bread from '@/assets/publicComponents/Bread.vue'
import Pagination from '@/assets/publicComponents/Pagination.vue'
export default {
  data () {
    return {
      bread: ['商品管理', '商品列表'],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      pSizes: ['1', '5', '10'],
      //   商品列表数据
      goodsList: [],
      total: 0
    }
  },
  components: {
    Bread, Pagination
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: { goods, total }, meta } = await this.$get('goods', {
        params: this.queryInfo
      })
      if (meta.status !== 200) {
        return this.$message.error('查询商品列表失败')
      }
      this.goodsList = goods
      this.total = total
    },
    // 每页显示多少条
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 当前页
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    // 清空输入框
    clearIpt () {
      this.getGoodsList()
    },
    queryData () {
      this.getGoodsList()
    },
    deleteGoodsById (id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { meta } = await this.$delete(`goods/${id}`)
        if (meta.status !== 200) {
          return this.$message({
            type: 'info',
            message: '删除失败'
          })
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getGoodsList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击添加商品
    addGoods () {
      this.$router.push({
        name: 'addgoods'
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
