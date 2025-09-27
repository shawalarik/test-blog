import { setStore } from "./store";

//获取授权链接
export const authorize = async () => {};

//轮询授权结果
export const oauthPolling = async state => {};

//查询登录用户信息
export const userinfo = async () => {
  const user = {};
  setStore({ user, isLogin: true });
  return user;
};

//退出登录
export const logout = async () => {};

//产品列表
export const productList = async () => {
  return {
    items: [
      {
        prod_id: "240003",
        prod_name: "天卡会员",
        unit_price: 990,
        mark_price: 990,
        intro: "",
        buy_url: "https://wxpay.mosong.cc/pro-vp/vpapi/meb/product-buy?uid=68d7e6bbf2d7af56647fb907&prod_id=240003"
      },
      {
        prod_id: "240002",
        prod_name: "月卡会员",
        unit_price: 3000,
        mark_price: 4900,
        intro: "",
        buy_url: "https://wxpay.mosong.cc/pro-vp/vpapi/meb/product-buy?uid=68d7e6bbf2d7af56647fb907&prod_id=240002"
      },
      {
        prod_id: "240001",
        prod_name: "年费会员",
        unit_price: 9800,
        mark_price: 36500,
        intro: "",
        buy_url: "https://wxpay.mosong.cc/pro-vp/vpapi/meb/product-buy?uid=68d7e6bbf2d7af56647fb907&prod_id=240001"
      }
    ]
  };
};

//产品购买
export const productBuyQryApi = async prod_id => {
  return { status: "finish" };
};
