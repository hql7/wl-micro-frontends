<template>
  <el-menu
    class="the-menu"
    :collapse="is_collapse"
    :text-color="themeMenu.text"
    :default-openeds="menuDefaultOpeneds"
    :background-color="themeMenu.background"
    :active-text-color="themeMenu.active_text"
  >
    <div class="the-menu-logo">{{is_collapse?'WL':'WL微前端项目'}}</div>
    <el-submenu v-for="sub of menu" :key="sub.id" :index="sub.id">
      <template slot="title">
        <i class="menu-icon" :class="sub.icon"></i>
        <span class="menu-sub-title">{{sub.title}}</span>
      </template>
      <el-menu-item
        v-for="item of sub.children"
        :key="item.id"
        :index="item.id"
        @click="goto(sub.module, item.url)"
      >
        <span class="menu-item-title">{{item.title}}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex"; // 引入状态共享
import { routerGo } from "@/library/js/util.js"; // 引入跨应用路由跳转
import {
  menu_background,
  menu_color,
  menu_active_color
} from "@/style/variables.scss.js"; // 导入菜单样式变量

export default {
  name: "theMenu",
  data() {
    return {
      theme_menu: {
        background: menu_background,
        text: menu_color,
        active_text: menu_active_color
      }, // 菜单主题
      menu_data: [
        {
          id: "1",
          title: "wl-ui组件",
          icon: "el-icon-monitor",
          module: "subapp-ui",
          children: [
            {
              id: "1-1",
              title: "表格",
              url: "/ui"
            },
            {
              id: "1-2",
              title: "日历",
              url: "/ui/about"
            }
          ]
        },
        {
          id: "2",
          title: "博客",
          icon: "el-icon-date",
          module: "subapp-blog",
          children: [
            {
              id: "2-1",
              title: "报表",
              url: "/blog"
            },
            {
              id: "2-2",
              title: "穿梭框",
              url: "/blog/about"
            }
          ]
        }
      ] // 菜单数据
    };
  },
  computed: {
    // 左侧菜单主题
    themeMenu() {
      return this.theme_menu;
    },
    // 左侧菜单默认展开
    menuDefaultOpeneds() {
      return this.menu_data.map(i => i.id);
    },
    // 导入vuex菜单数据，菜单折叠状态
    ...mapGetters(["menu", "is_collapse"])
  },
  methods: {
    // 跨应用路由跳转
    goto(title, href) {
      routerGo(href, title);
    }
  }
};
</script>

<style lang="scss">
.the-menu {
  height: 100%;
  width: 200px;
  border-color: #2a3f54;
  .the-menu-logo {
    height: 60px;
    text-align: center;
    line-height: 60px;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
  }
  .menu-icon {
    color: #fff;
  }
  .menu-sub-title {
    margin-left: 6px;
    font-weight: 600;
  }
}
</style>
