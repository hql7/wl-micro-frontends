<template>
  <div class="home">
    <!-- 非首页 -->
    <template>
      <topbar v-show="isNotIndex" @changeCollapse="changeCollapse" />
      <el-scrollbar class="homeLeft" v-show="isNotIndex">
        <sidebar @changeCollapse="changeCollapse" :isCollapse="isCollapse" />
      </el-scrollbar>

      <el-main
        :class="{'homePages-mini': !isCollapse && isNotIndex, 'homePages': isNotIndex, 'is-index': !isNotIndex}"
      >
        <div
          class="collapse"
          @click="handleCollapse"
          v-show="!($route.name == 'systemUser') && isNotIndex"
        >
          <img
            src="data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAaUlEQVQoU3XPOQoCQRAF0PcPIZ5JRTCYzMQlEE+lt1QxKBmwh1a0oqL61dKBqprhgiHJfay1SEuqasAJ6x5N4D1pi12PPkCH9lgkef4DR6yS3H6tOGCZ5DFO/D7y3D9OoKrmuGLTOtvvXrr4KAkA7ro5AAAAAElFTkSuQmCC"
          />
        </div>
        <div class="navTab" v-show="isNotIndex">
          <tagbar :isCollapse="isCollapse" />
        </div>
        <div
          class="home-container"
          :class="{'no-bg': isNoBg && isIndex, 'content': isNotIndex, 'is-index': !isNotIndex}"
        >
          <!--<router-view/>-->
          <template v-if="!isNotIndex">
            <keep-alive :include="cachedViews">
              <router-view :key="$route.fullPath" />
            </keep-alive>
          </template>
          <!-- 子应用加载 content-->
          <template>
            <!--<div v-show="$route.path === '/'" id="basicInformationIndex" v-html="contentStorage['/']"></div> -->
            <div
              class="basicInformationIndex"
              v-show="$route.name === 'basicInformationIndex'"
              v-html="contentStorage['basicInformationIndex']"
            ></div>
            <div
              class="networkManagementIndex"
              v-show="$route.name === 'networkManagementIndex'"
              v-html="contentStorage['networkManagementIndex']"
            ></div>
            <div
              class="businessIndicatorIndex"
              v-show="$route.name === 'businessIndicatorIndex'"
              v-html="contentStorage['businessIndicatorIndex']"
            ></div>
            <div
              class="customerPlatformIndex"
              v-show="$route.name === 'customerPlatformIndex'"
              v-html="contentStorage['customerPlatformIndex']"
            ></div>
            <div
              class="dataCabinndex"
              v-show="$route.name === 'dataCabinndex'"
              v-html="contentStorage['dataCabinndex']"
            ></div>
            <div
              class="financialManagementIndex"
              v-show="$route.name === 'financialManagementIndex'"
              v-html="contentStorage['financialManagementIndex']"
            ></div>
            <div
              class="integratedServicesIndex"
              v-show="$route.name === 'integratedServicesIndex'"
              v-html="contentStorage['integratedServicesIndex']"
            ></div>
            <div
              class="operatingPlatformIndex"
              v-show="$route.name === 'operatingPlatformIndex'"
              v-html="contentStorage['operatingPlatformIndex']"
            ></div>
            <div
              class="serviceQualityIndex"
              v-show="$route.name === 'serviceQualityIndex'"
              v-html="contentStorage['serviceQualityIndex']"
            ></div>
            <div
              class="smartDeviceIndex"
              v-show="$route.name === 'smartDeviceIndex'"
              v-html="contentStorage['smartDeviceIndex']"
            ></div>
            <div
              class="transportPlatformNewIndex"
              v-show="$route.name === 'transportPlatformNewIndex'"
              v-html="contentStorage['transportPlatformIndex']"
            ></div>
          </template>
        </div>
      </el-main>
    </template>
  </div>
</template>

<script>
// keepalive
import Sidebar from "./SideBar";
import Topbar from "./TopBar";
import Tagbar from "./TagBar";
import { mapActions, mapGetters } from "vuex";
import debounce from "lodash/debounce";
import { cacheHelper } from "@public/utils/cacheHelper";
export default {
  name: "Layout",
  components: {
    Sidebar,
    Topbar,
    Tagbar
  },
  data() {
    return {
      isCollapse: false,
      calcHeight: 169,
      restHeight: 0,
      clientHeight: 1080,
      platformId: "",
      contentStorage: {},
      contentNow: ""
    };
  },
  props: {
    isChildApp: {
      type: Boolean,
      default() {
        return false;
      }
    },
    // loading: Boolean,
    //  子系统html
    content: String
  },
  computed: {
    ...mapGetters({
      user: "user"
    }),
    // 是否首页（唯一首页，非子系统的首页）
    isNotIndex() {
      return this.$route.name !== "index";
    },
    ...mapGetters({
      tableHeight: "tableHeight",
      cachedViews: "tags/cachedViews"
    }),
    isNoBg() {
      const routeName = this.$route.name;
      return (
        routeName === "addWaybill" ||
        routeName === "problemParcelDispose" ||
        routeName === "problemParcelDisposeDetail"
      );
    },
    // 获取当前标题
    title() {
      const title = this.$route.meta.title || this.$route.meta.name;
      return title ? "JMS-" + this.$lang(title) : "JMS";
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === "login" || to.path === "path" || to.name === "index") {
        this.isCollapse = false;
      }
      // 设置标题
      console.log(
        "gateway layout $route(to, from)",
        to,
        to.path.match("/app/")
      );
      this.UPDATE_ACTIVE_ROUTE(to.name);
      this.$nextTick(() => {
        this.calcTableHeight();
      });
    },
    content: {
      handler(val, oldVal) {
        console.log(
          "content1",
          window.location.pathname,
          this.content,
          this.contentStorage
        );
        const systemName = window.location.pathname.split("/")[2];
        // systemName = systemName || window.location.pathname //  如果是根路径“/”
        //  缓存第一次
        if (systemName && !this.contentStorage[systemName]) {
          this.$set(this.contentStorage, systemName, this.content);
        }
        console.log(
          "content2",
          window.location.pathname,
          this.content,
          this.contentStorage
        );
      },
      immediate: true
    }
  },
  created() {
    window.contentStorage = [];
    const userInfo = this.user || {};
    let text = userInfo.name;
    text += userInfo.staffNo ? "-" + userInfo.staffNo : "";
    text += userInfo.loginTime ? "-" + userInfo.loginTime.substr(0, 10) : "";
    this.watermark({ text });
  },
  mounted() {
    console.log("this.isCollapse", this.isCollapse);
    this.$nextTick(() => {
      this.calcTableHeight();
      // 绑定窗口resize事件
      const fn = debounce(this.calcTableHeight, 200); // 表格高度计算防抖
      window.addEventListener("resize", fn, false);
      // 触发destroyed钩子，移除resize的监听事件
      this.$once("hook:destroyed", () => {
        window.removeEventListener(
          "resize",
          debounce(this.calcTableHeight, 200),
          false
        );
      });
    });
    // cacheHelper.getMaximun()
    cacheHelper.getUsage();
    // 监听高度重算事件
    this.$bus.$on("doLayout", () => {
      this.$nextTick(() => this.calcTableHeight());
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$bus.$off("doLayout");
    next();
  },
  destroyed() {
    // 清除定时任务/绑定事件/eventBus事件
    // window.removeEventListener('resize', debounce(this.calcTableHeight, 200), false)
    this.$bus.$off("doLayout");
  },
  methods: {
    ...mapActions({
      setCollapse: "setCollapse",
      setTableHeight: "setTableHeight",
      UPDATE_ACTIVE_ROUTE: "tags/UPDATE_ACTIVE_ROUTE"
    }),
    changeCollapse(value) {
      // @defect 子系统接收不到了
      this.isCollapse = value;
    },
    handleCollapse() {
      this.isCollapse = !this.isCollapse;
      this.$bus.$emit("toggleCollapse", this.isCollapse);
    },
    // 计算元素的高度用于表格自适应
    getRestHeight() {
      const arr = [
        "Title",
        "Search",
        "Pagination",
        "Menu",
        "Tip",
        "SearchExtend"
      ];
      let height = 0;
      arr.forEach(function(id) {
        const els = document.querySelectorAll("#jms" + id);
        els.forEach(item => {
          // console.log(item.id + ':', item.clientHeight);
          if (item.offsetParent !== null) {
            height += item.clientHeight;
          }
        });
      });
      return height;
    },
    calcTableHeight() {
      this.clientHeight = document.documentElement.clientHeight;
      this.restHeight = this.getRestHeight();
      let tableHeight = this.clientHeight - this.restHeight - this.calcHeight;
      tableHeight = tableHeight * window.devicePixelRatio;
      console.log(tableHeight);
      this.setTableHeight(tableHeight);
    }
  }
};
</script>
<style lang="scss" rel="text/css" scoped>
.no-bg {
  background: none;
}
.is-index {
  padding: 0;
  height: 100%;
}
.home-container {
  position: relative;
}
</style>
