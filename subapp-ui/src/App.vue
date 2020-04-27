<template>
  <div id="app">
    <h2>
      基础数据子应用
      <span class="right">auth:weilan</span>
    </h2>
    <div id="nav">
      <span>切换路由：</span>
      <el-button-group class="right">
        <el-button type="primary" size="medium" @click="routerChange('/')"
          >表格</el-button
        >
        <el-button type="primary" size="medium" @click="routerChange('/about')"
          >日历</el-button
        >
        <el-button type="primary" size="medium" @click="toAppReport('/blog/')"
          >报表</el-button
        >
        <el-button
          type="primary"
          size="medium"
          @click="toAppReport('/blog/about')"
          >穿梭框</el-button
        >
      </el-button-group>
    </div>
    <div class="parent-child-communication">
      <h3>父子应用通信：</h3>
      <div style="margin-bottom: 20px;">
        <span>rxjs通信方案：{{ myMsg }}</span>
        <el-button
          class="right"
          type="primary"
          size="medium"
          @click="callParentChange('rxjs')"
          >通知父应用变天了</el-button
        >
      </div>
      <div>
        <span>官方通信方案：{{ myMessage }}</span>
        <el-button
          class="right"
          type="primary"
          size="medium"
          @click="callParentChange('default')"
          >通知父应用收到</el-button
        >
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "basic-app",
  props: {
    msg: String,
    message: String
  },
  data() {
    return {
      myMsg: "",
      myMessage: "",
    };
  },
  created() {
    this.myMsg = this.msg;
    this.myMessage = this.message;
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
      this.$mainUtils.routerGo(url);
    },
    /**
     * 通知父应用变天了
     * type 通信方案
     */
    callParentChange(type) {
      if (type === "default") {
        this.myMessage = "子应用subapp-ui收到";
        this.$actions.setGlobalState({
          message: this.myMessage,
          from: "subapp-ui"
        });
        return;
      }
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
