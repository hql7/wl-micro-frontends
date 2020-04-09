<template>
  <div class="basic-home">
    <el-button size="small" type="primary" @click="layout.fadein = true">点击调用主应用下发的【fadein】组件</el-button>
    <h4>树形表格</h4>
    <WlTable></WlTable>
    <wl-fadein :show.sync="layout.fadein">
      <span slot="header">表单头部</span>
      <div slot="footer">
        <el-button size="small" @click="layout.fadein = false">取 消</el-button>
        <el-button size="small" type="primary" @click="layout.fadein = false">确 定</el-button>
      </div>
    </wl-fadein>
  </div>
</template>

<script>
import WlTable from "@/components/wl-table.vue";

export default {
  name: "basic-home",
  components: { WlTable },
  data() {
    return {
      layout: {
        fadein: false
      }
    };
  }
};
</script>
