
/**
 * 关闭视图函数
 * @param {*} layout 所要关闭的管理视图的对象
 * @param {*} opend 对象中保留打开的一个，关闭其他的
 */
function closeLayout(layout, opend) {
  for (let i in layout) {
    layout[i] = false;
  }
  opend && (layout[opend] = true)
}

export {
  closeLayout, // 关闭视图函数
}