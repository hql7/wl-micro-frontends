<template>
  <div class="the-nav">
    <!-- 菜单折叠按钮 -->
    <i
      class="nav-icon"
      :class="isCollapse?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
      @click="setMenuCollapseStatus()"
    ></i>
    <!-- 右侧操作区 -->
    <div class="nav-handle-box">
      <!-- 消息按钮 -->
      <i class="nav-icon nav-handle-item el-icon-bell"></i>
      <!-- 全屏按钮 -->
      <i class="nav-icon nav-handle-item el-icon-rank" @click="handleFullScreen"></i>
      <!-- 用户名 -->
      <span class="nav-handle-item nav-user-name">{{user_name}}</span>
      <!-- 退出登录按钮 -->
      <i class="nav-icon nav-handle-item el-icon-switch-button"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "theNav",
  data() {
    return {
      user_name: "Admin", // 名称 // 用户信息
      full_screen: false // 是否全屏
    };
  },
  computed: {
    isCollapse() {
      return this.$store.getters.is_collapse;
    }
  },
  create() {},
  methods: {
    // 设置左侧菜单折叠状态
    setMenuCollapseStatus() {
      this.$store.dispatch("menu/setCollapseStatus", !this.isCollapse);
    },
    // 全屏操作
    handleFullScreen() {
      let element = document.documentElement;
      if (this.full_screen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }
      this.full_screen = !this.full_screen;
    },
    // 暂未开通，敬请期待
    notYetOpened() {
      this.$message({});
    }
  }
};
</script>

<style lang="scss">
.the-nav {
  display: flex;
  justify-content: space-between;
  height: 60px;
  padding: 15px;
  line-height: 30px;
  background: #A3B6C6;
  color: #fff;
  box-shadow: #b2b2b2 1px 4px 5px 2px;
  box-sizing: border-box;

  .nav-icon,
  .nav-user-name {
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
  }

  .nav-handle-item + .nav-handle-item {
    margin-left: 12px;
  }
}
</style>