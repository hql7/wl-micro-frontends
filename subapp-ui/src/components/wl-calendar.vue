<template>
  <el-calendar v-model="value"></el-calendar>
</template>

<script>
export default {
  data() {
    return {
      value: new Date()
    };
  }
};
</script>