<template>
  <div id="app">
    <h2>
      基础数据子应用
      <span class="right">auth:weilan</span>
    </h2>
    <div id="nav">
      <el-button-group>
        <el-button type="primary" @click="routerChange('/')">表格</el-button>
        <el-button type="primary" @click="routerChange('/about')">日历</el-button>
      </el-button-group>
      <el-button class="right" type="primary" @click="callParentLogout('Im going')">通知父应用退出登录</el-button>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "basic-app",
  methods: {
    /**
     * 路由切换
     * url 路由地址
     */
    routerChange(url) {
      this.$router.push(url).catch(err => {
        console.log(err);
      });
    },
    /**
     * 通知父应用退出登录
     * data 自定义数据
     */
    callParentLogout(data) {
      this.LOGOUT_(data);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
</style>
