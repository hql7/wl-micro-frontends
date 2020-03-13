<template>
  <el-scrollbar class="wl-scroll">
    <slot></slot>
  </el-scrollbar>
</template>

<script>
export default {
  name: "wl-scroll"
};
</script>

<style lang="scss">
.wl-scroll {
  flex: 1;
  > .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>