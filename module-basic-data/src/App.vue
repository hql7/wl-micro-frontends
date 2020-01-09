<template>
  <div id="app">
    <h2>基础数据子应用 <span class="right">auth:weilan</span></h2>
    <div id="nav">
      <el-button-group>
        <el-button type="primary" @click="routerChange('/')">表格</el-button>
        <el-button type="primary" @click="routerChange('/about')">日历</el-button>
      </el-button-group>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "basic-app",
  components: {},
  methods: {
    /**
     * 路由切换
     * url 路由地址
     */
    routerChange(url) {
      this.$router.replace(url);
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
