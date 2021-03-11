<template>
  <div>
    <Bread :bread="bread" />
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        center
        show-icon>
      </el-alert>
      <el-steps :space="200" align-center :active="activeIndex - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" label-position="top" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeCateLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="cb.attr_name" v-for="cb in goodsList" :key="cb.attr_id">
              <el-checkbox-group v-model="cb.attr_vals">
                <el-checkbox :label="item" border v-for="(item, i) in cb.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="url"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="uploadSuccess"
              :headers="headers"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="5">
            <el-button type="primary" @click="add">提交商品信息</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="预览"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <img :src="src" style="width: 100%;height: 100%;"/>
    </el-dialog>
  </div>
</template>
<script>
import Bread from '@/assets/publicComponents/Bread.vue'
import _ from 'lodash'
export default {
  data () {
    return {
      bread: ['商品管理', '商品添加'],
      // 当前激活的 进度
      activeIndex: '0',
      // 商品数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 上传的图片列表
        pics: [],
        // 商品描述
        goods_introduce: '',
        // 存储动态属性以及静态属性信息
        attrs: []
      },
      // 验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类
      cateList: [],
      // 分类配置
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 商品参数数据
      goodsList: [],
      // 商品属性
      onlyList: [],
      // 上传图片路径
      url: 'https://www.liulongbin.top:8888/api/private/v1/upload',
      dialogVisible: false,
      src: ''
    }
  },
  components: {
    Bread
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
    // 设置请求头 token
    headers () {
      return {
        Authorization: this.$store.state.token ? this.$store.state.token : window.sessionStorage.getItem('logintoken')
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data, meta } = await this.$get('categories')
      if (meta.status !== 200) {
        return this.$message.error('查询商品分类失败')
      }
      this.cateList = data
    },
    // 分类数据放生改变
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeCateLeave (activeName, oldActiveName) {
      // console.log(activeName, oldActiveName)
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async tabClick () {
      if (this.activeIndex === '1' && this.cateId) {
        const { data, meta } = await this.$get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (meta.status !== 200) {
          return this.$message.error('查询商品信息失败')
        }
        data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.goodsList = data
      } else if (this.activeIndex === '2' && this.cateId) {
        const { data, meta } = await this.$get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        console.log(data)
        if (meta.status !== 200) {
          return this.$message.error('查询商品属性信息失败')
        }
        this.onlyList = data
      }
    },
    // 预览事件
    handlePreview (file) {
      const { response: { data: { url } } } = file
      this.src = url
      this.dialogVisible = true
    },
    // 删除事件
    handleRemove (file) {
      // console.log(file)
      const { response: { data: { tmp_path: path } } } = file
      this.addForm.pics = this.addForm.pics.filter(item => item.pic !== path)
    },
    // 上传图片成功
    uploadSuccess (response, file) {
      const { data } = response
      const json = {
        pic: data.tmp_path
      }
      this.addForm.pics.push(json)
    },
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 先清空
        this.addForm.attrs = []
        this.goodsList.forEach(item => {
          const json = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(json)
        })
        this.onlyList.forEach(item => {
          const json = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(json)
        })
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        const { meta } = await this.$post('goods', form)
        if (meta.status !== 201) {
          return this.$message.error(meta.msg)
        }
        this.$router.push({
          path: '/home/goods'
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.quill-editor {
  min-height: 200px !important;
}
</style>
