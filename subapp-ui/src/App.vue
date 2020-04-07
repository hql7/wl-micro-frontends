<template>
  <div id="app">
    <h2>
      基础数据子应用
      <span class="right">auth:weilan</span>
    </h2>
    <div id="nav">
      <span>切换路由：</span>
      <el-button-group class="right">
        <el-button type="primary" size="medium" @click="routerChange('/')">表格</el-button>
        <el-button type="primary" size="medium" @click="routerChange('/about')">日历</el-button>
        <el-button type="primary" size="medium" @click="toAppReport('/app2/')">报表</el-button>
        <el-button type="primary" size="medium" @click="toAppReport('/app2/about')">穿梭框</el-button>
      </el-button-group>
    </div>
    <div class="parent-child-communication">
      <h3>父子应用通信：</h3>
      <span>{{myMsg}}</span>
      <el-button class="right" type="primary" size="medium" @click="callParentChange()">通知父应用变天了</el-button>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "basic-app",
  props: {
    msg: String
  },
  data() {
    return {
      myMsg: ""
    };
  },
  created() {
    this.myMsg = this.msg;
  },
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
     * 跨应用路由切换
     * url 路由地址
     */
    toAppReport(url) {
      this.routerGo(url);
    },
    /**
     * 通知父应用变天了
     */
    callParentChange() {
      this.myMsg = "但若不见你，阳光也无趣";
      this.$pager.next({
        from: "subapp-ui",
        token: "但若不见你，阳光也无趣"
      });
    }
  }
};
</script>

<style lang="scss">
.parent-child-communication {
  padding: 20px 0;
  line-height: 36px;
}
</style>>
