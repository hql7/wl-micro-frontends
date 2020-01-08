<template>
  <div id="root">
    <div id="nav">
      <div @click="goto('app-basic','/basic')">基础数据</div>
      <div @click="goto('app-report','/report')">报表</div>
    </div>
    <div id="app-view" v-html="content"></div>
  </div>
</template>

<script>
export default {
  name: "base-view",
  props: {
    loading: Boolean,
    content: String
  },
  methods: {
    goto(title, href) {
      console.log("title", title, "href", href);
      window.history.pushState({}, title, href);
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
