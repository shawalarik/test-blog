import { reactive } from "vue";

//全局状态
export const $store = reactive({
  //主题配置
  theme: {},
  // 是否显示登录弹框
  loginVisible: false,
  //是否已登录
  isLogin: false,
  // 登录用户信息
  user: { uid: "", nickname: "", avatar: "" }
});

export default $store;

export const setStore = function (v = {}) {
  Object.assign($store, v);
};
