/**
 * auth:weilan
 * time:2019/12/24 09:53
 * 按钮操作权限校验mixin
 * 将mixin注入所有需要按钮权限校验的菜单
 * 请注意_owner变量已被权限校验模块占用
 * 请注意_matchingOwner函数已被权限校验模块占用
 */
const permissionCheck = {
  data() {
    return {
      _owner: [], // 当前路由权限码数组
    }
  },
  created() {
    let _purview_array = this.$route.meta.purview || [];
    this._owner = _purview_array.map(item => item.Code);
  },
  methods: {
    /**
     * 校验当前路由是否有所传权限码代表的权限
     * @param {*} auth 权限码
     */
    _matchingOwner(auth) {
      return this._owner.some(item => item === auth);
    }
  }
}

export default permissionCheck;