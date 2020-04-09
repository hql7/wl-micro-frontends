import request from "./_request";

// 1获取菜单数据接口
function getAppConfigApi(data) {
  return request({
    url: "/Api/GetAppConfigs",
    method: 'post',
    data
  });
}

export {
  getAppConfigApi, // 1获取菜单数据接口
}