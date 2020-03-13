/**
 * 路由监听
 * @param {String} routerPrefix 路由前缀
 */
function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix);
}


export {
  genActiveRule, // 路由监听
}