<template>
  <el-menu
    default-active="1-1"
    class="el-menu-vertical-demo"
    :default-openeds="['1','2','5','5-4']"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>基础数据子应用</span>
      </template>
      <el-menu-item index="1-1" @click="goto('app-basic','/basic')">表格</el-menu-item>
      <el-menu-item index="1-2" @click="goto('app-basic','/basic/about')">日历</el-menu-item>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>报表子应用</span>
      </template>
      <el-menu-item index="1-3" @click="goto('app-basic','/report')">报表</el-menu-item>
      <el-menu-item index="1-3" @click="goto('app-basic','/report/about')">穿梭框</el-menu-item>
    </el-submenu>
    <el-menu-item index="3" disabled>
      <i class="el-icon-document"></i>
      <span slot="title">导航三</span>
    </el-menu-item>
    <el-menu-item index="4">
      <i class="el-icon-setting"></i>
      <span slot="title">导航四</span>
    </el-menu-item>
    <el-submenu index="5">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>导航五</span>
      </template>
      <el-menu-item-group>
        <template slot="title">分组一</template>
        <el-menu-item index="5-1">选项1</el-menu-item>
        <el-menu-item index="5-2">选项2</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="分组2">
        <el-menu-item index="5-3">选项3</el-menu-item>
      </el-menu-item-group>
      <el-submenu index="5-4">
        <template slot="title">选项4</template>
        <el-menu-item index="5-4-1">选项1</el-menu-item>
      </el-submenu>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    // 调起子应用
    goto(title, href) {
      window.history.pushState({}, title, href);
    }
  }
};
</script>
