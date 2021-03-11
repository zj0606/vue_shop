<template>
  <div>
    <Bread :bread="bread"/>
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="searchData">
            <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <template v-slot:default="scope">
            <el-button size="mini" :type="scope.row.pay_status === '0'? 'danger' : 'primary'" plain>{{ scope.row.pay_status === '0'? '未付款' : '已付款' }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
          <template v-slot:default="scope">
            {{ scope.row.create_time | createTimeFormate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="primary" icon="el-icon-location-outline" @click="showProgressBox(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :cPage="queryInfo.pagenum"
        :pSizes="pSizes"
        :pSize="queryInfo.pagesize"
        :total="total"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      />
    </el-card>
    <el-dialog
      title="物流进度"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(activity, index) in orderData"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import Bread from '@/assets/publicComponents/Bread.vue'
import Pagination from '@/assets/publicComponents/Pagination.vue'
export default {
  data () {
    return {
      bread: ['订单管理', '订单列表'],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      pSizes: [5, 10, 15],
      //   订单列表
      orderList: [],
      dialogVisible: false,
      //   运单信息
      orderData: []
    }
  },
  components: {
    Bread, Pagination
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: { goods, total }, meta } = await this.$get('orders', {
        params: this.queryInfo
      })
      if (meta.status !== 200) {
        return this.$message.error(meta.msg)
      }
      this.total = total
      this.orderList = goods
    },
    // 每页显示条数改变
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getOrderList()
    },
    //  当前第几页放生改变
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getOrderList()
    },
    // 查询数据
    searchData () {
      this.getOrderList()
    },
    // 显示物流进度
    async showProgressBox (info) {
      const { data, meta } = await this.$get('/kuaidi/804909574412544580')
      if (meta.status !== 200) {
        return this.$message.error('查询运单信息失败')
      }
      this.orderData = data
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="less" scoped>

</style>
