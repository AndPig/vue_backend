<template>
  <!-- 页面布局  应该先上下布局 然后左右布局 -->
  <div id="app">
    <el-container class="home_container">
      <el-header>
        <div>
          <span class="iconfont icon-Windsurfing">后台电商管理系统</span>
        </div>
        <div class="head_link">
          <el-link disabled>
            <i class="el-icon-share"></i>admin
          </el-link>
          <el-link type="primary" disabled>
            <i class="el-icon-edit"></i>2020-03-21
          </el-link>
          <el-link type="success" disabled>
            <i class="el-icon-share"></i>退出
          </el-link>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="isCollaps?'64px':'200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- $route.path得到当前请求路径 -->
          <el-menu
            :default-active="$route.path"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :collapse="isCollaps"
            :collapse-transition="false"
            :router="true"
          >
            <!-- 在这里index只接受字符串  而item.id是数值 所以需要转化 
            在这里为什么需要要动态绑定index  因为  菜单项 是根据indexz展开的
            -->
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item :index="'/'+subItem.path+''" @click="saveNavState('/'+subItem.path+'')" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容主体 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      //左侧菜单结构
      menuList:[],
      iconsObj:{
        '125': 'iconfont icon-yonghu2',
        '103': 'iconfont icon-xitong-',
        '101': 'iconfont icon-shangpinxinxiguanli',
        '102': 'iconfont icon-jinhuoguanli',
        '145': 'iconfont icon-xiaoshouguanli'
      },
      isCollaps:false,
      //被激活的连接地址
      activePath:''
    };
  },
  watch: {},
  computed: {},
  methods: {
    //退出功能
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //导航栏折叠 展开切换
    toggleCollapse(){
      this.isCollaps = !this.isCollaps
    },
    // 获取所有的菜单
    async getMenuList(){
       
      const{data:res}= await this.$http.get('menus')

      if(res.meta.status!==200)
            return this.$message.error(res.meta.msg);
            this.menuList=res.data 
    },
    // 保持连接的激活状态
    saveNavState(activePath){
        window.sessionStorage.setItem('saveNavState',saveNavState)
    }
  },
  created() {
    this.getMenuList()

  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.head_link {
  float: right;
}
.el-header span {
  font-size: 20px;
  color: aliceblue;
  position: absolute;
  margin-top: 10px;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  position: relative;
}

.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: 0px;
  }
}

.el-main {
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  text-align: center;
  color: aliceblue;
  letter-spacing: 0.2em;
  background-color:#333744;
  font-size: 10px;
  cursor: pointer;
}
</style>