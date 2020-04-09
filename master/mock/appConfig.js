
const appConfig = [
  {
    id: "1",
    title: "wl-ui组件",
    icon: "el-icon-monitor",
    module: "subapp-ui",
    defaultRegister: true,
    entry: "//localhost:6651",
    routerBase: "/ui",
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
    defaultRegister: false,
    entry: "//localhost:6652",
    routerBase: "/blog",
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
]

export default [
  {
    url: '/Api/GetAppConfigs',
    type: 'post',
    response: () => {
      return {
        code: 200,
        data: appConfig
      }
    }
  },
]
