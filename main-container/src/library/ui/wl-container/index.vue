<template>
  <div class="wl-container">
    <el-scrollbar class="wl-container-scroll">
      <slot></slot>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: "wl-container"
};
</script>

<style>
.wl-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 8px;
}
</style>