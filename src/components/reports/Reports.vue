<template>
  <div>
    <Bread :bread="bread"/>
    <el-card>
      <div id="main"></div>
    </el-card>
  </div>
</template>
<script>
import Bread from '@/assets/publicComponents/Bread.vue'
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data () {
    return {
      bread: ['数据统计', '统计报表'],
      options: []
    }
  },
  components: {
    Bread
  },
  methods: {
    myEcharts () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }
      const op = _.merge(option, this.options)
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(op)
    }
  },
  async mounted () {
    const { data, meta } = await this.$get('reports/type/1')
    if (meta.status !== 200) {
      return this.$message.error('查询失败')
    }
    this.options = data
    this.myEcharts()
  }
}
</script>
<style lang="less" scoped>
#main {
  height: 400px;
}
</style>
