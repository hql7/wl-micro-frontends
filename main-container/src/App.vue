<template>
  <div id="root" class="main-container">
    <div class="main-container-menu">
      <MenuItem class="main-menu-box" />
    </div>
    <div id="root-view" class="app-view-box" v-html="content"></div>
  </div>
</template>

<script>
import MenuItem from "@/components/menu.vue";

export default {
  name: "root-view",
  components: {
    MenuItem
  },
  props: {
    loading: Boolean,
    content: String
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
  height: 100%;
  > .main-container-menu {
    width: 200px;
    height: 100%;
    background-color: #545c64;
    > .main-menu-box {
      border: none;
    }
  }
  > .app-view-box {
    flex: 1;
    padding: 12px;
  }
}
</style>
