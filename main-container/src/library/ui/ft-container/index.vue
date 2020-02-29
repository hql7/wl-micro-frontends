<template>
  <div class="ft-container">
    <el-scrollbar class="ft-container-scroll">
      <slot></slot>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: "ft-container"
};
</script>

<style>
.ft-container {
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