<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        电商后台管理系统
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
        <el-aside :width="!iscollapse?'200px':'64px'">
          <div class="collapseBtn" @click="iscollapse=!iscollapse">|||</div>
          <el-menu
            :default-active="activeMenu"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#2d77c1"
            router
            unique-opened
            :collapse="iscollapse"
            :collapse-transition='false'
            >
            <el-submenu :index="item.id +''" v-for="item in menu" :key="item.id">
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item :index="item1.path+''" v-for="item1 in item.children" :key="item1.id" @click="saveActiveMenu(item1.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{item1.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      iconObj: {
        125: 'el-icon-user-solid',
        103: 'iconfont icon-quanxian',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-marketing'
      },
      iscollapse: false
    }
  },
  beforeRouteEnter (to, from, next) {
    // 刷新页面时激活当前菜单
    next(vm => {
      if (/^\/home/g.test(to.path)) {
        const path = to.path.replace('/home/', '')
        vm.activeMenuAction(path)
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    // 浏览器自带的前进后退功能 根据to路由参数 实现激活高亮当前菜单
    if (/^\/home/g.test(to.path)) {
      const path = to.path.replace('/home/', '')
      this.activeMenuAction(path)
    }
    next()
  },
  mounted () {
  },
  watch: {
    $route (to, from) {
    }
  },
  name: 'home',
  computed: {
    ...mapState('login/menu', {
      menu: state => state.menus,
      activeMenu: state => state.activeMenu
    })
  },
  methods: {
    // 退出事件
    logout () {
      this.$store.dispatch({
        type: 'login/loginAction',
        token: null
      })
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 查询菜单的请求
    async getMenus () {
      const { data, meta } = await this.$get('menus')
      if (meta.status === 200) {
        this.setMenuAction(data)
      } else {
        this.$message.error('查询菜单失败')
      }
    },
    // 点击菜单时 激活当前菜单
    saveActiveMenu (path) {
      this.activeMenuAction(path)
    },
    ...mapActions('login/menu', [
      'setMenuAction',
      'activeMenuAction'
    ])
  },
  created () {
    this.getMenus()
  }
}
</script>

<style lang="less" scoped>
 .el-container {
    height: 100%;
 }
 .el-header {
    background-color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    > div {
      display: flex;
      align-content: center;
      font-size: 20px;
      color: #fff;
      img {
        width: 25px;
        height: 25px;
      }
    }
 }
 .el-aside {
    background-color: #eee;
    .el-submenu .el-menu-item{
      min-width: 100%;
    }
 }
 .el-main {
     background-color: #fff;
 }
 .iconfont {
   margin-right: 10px;
 }
 .collapseBtn{
   line-height: 24px;
   text-align: center;
   letter-spacing: 0.2em;
   background-color: rgb(84, 92, 100);
   color: #fff;
   cursor: pointer;
 }
</style>
