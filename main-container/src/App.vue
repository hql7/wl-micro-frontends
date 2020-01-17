<template>
  <div id="root" class="main-container">
    <!-- 左侧菜单区 -->
    <div class="main-container-menu">
      <div class="main-logo">{{isCollapse?'WL':'WeiLan'}}</div>
      <the-menu class="main-menu-box" />
    </div>
    <!-- 右侧视图 -->
    <div class="main-container-content">
      <!-- 上部导航区 -->
      <the-nav />
      <!-- 子应用渲染区 -->
      <div class="main-container-view">
        <el-scrollbar class="wl-scroll">
          <div id="root-view" class="app-view-box" v-html="content"></div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import TheMenu from "@/components/TheMenu.vue";
import TheNav from "@/components/TheNav.vue";

export default {
  name: "rootView",
  components: {
    TheMenu,
    TheNav
  },
  props: {
    loading: Boolean,
    content: String
  },
  computed: {
    isCollapse() {
      return this.$store.getters.is_collapse;
    }
  }
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
.main-container {
  display: flex;
  width: 100%;
  height: 100%;
}
.main-logo {
  height: 60px;
  background: #2a3f54;
  text-align: center;
  line-height: 60px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}
.main-container-content {
  flex: 1;
  display: flex;
  flex-flow: column;
  overflow: hidden;
  > .main-container-view {
    padding: 15px;
    width: 100%;
    height: calc(100% - 60px);
    background: #f2f3f3;
    box-sizing: border-box;
    > .wl-scroll {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 4px;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }

    .app-view-box {
      width: 100%;
      padding: 12px;
      box-sizing: border-box;
    }
  }
}
</style>
