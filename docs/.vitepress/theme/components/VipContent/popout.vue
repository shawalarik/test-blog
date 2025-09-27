<script setup>
import { data } from "./data";

// 购买会员组件在 /layout/Layout.vue 全局使用

import { watch } from "vue";
import QRCode from "qrcode";
import { userinfo, productList, productBuyQryApi } from "./api";

// 查订单状态
async function productBuyQry() {
  /*  if (!data.visible) {
    return;
  }
  try {
    const body = await productBuyQryApi(data.active);
    if (body && body.status === "finish") {
      //成功，更新用户信息，隐藏购买弹框
      await userinfo();
      data.visible = false;
      return;
    }
  } catch (e) {
    console.log(e);
  }
  setTimeout(async () => await productBuyQry(), 10 * 1000);*/
}

// 选择会员
async function selectVip(active, buyUrl) {
  data.active = active;
  data.payQrcode = await QRCode.toDataURL(buyUrl, { width: 400, margin: 0 });
}

// 弹出购买界面时查询产品
watch(
  () => data.visible,
  async () => {
    if (data.visible) {
      data.datum = await productList();
      console.log("await productList()", data.datum);
      if (data.datum.items && data.datum.items.length > 0) {
        const prod = data.datum.items[1];
        await selectVip(prod.prod_id, prod.buy_url);
      }
      // 定时查询订单状态
      await productBuyQry();
    }
  }
);
</script>

<!--支付弹框界面 -->
<template>
  <Teleport to="body">
    {{ data }}
    <div class="vip-popout" v-if="data.visible">
      <div class="shade" @click="data.visible = false"></div>
      <div class="content">
        <div class="close" @click="data.visible = false">X</div>
        <div class="title"><h1>开通会员</h1></div>
        <div class="section">
          <div class="prods">
            <template v-for="(prod, index) in data.datum.items" :key="index">
              <div class="prod" @click="selectVip(prod.prod_id, prod.buy_url)">
                <div :class="data.active === prod.prod_id ? 'msprod msprod-active' : 'msprod'">
                  <h2>{{ prod.prod_name }}</h2>
                  <div class="price">
                    <span class="unitPrice">
                      ¥
                      <span class="amt">{{ (prod.unit_price / 100).toFixed(2) }}</span>
                    </span>
                    <span class="markPrice">
                      ¥
                      <span>{{ (prod.mark_price / 100).toFixed(2) }}</span>
                    </span>
                  </div>
                  <div class="rights" v-html="prod.intro"></div>
                </div>
              </div>
            </template>
          </div>
          <div class="pay" v-if="data.active && data.active !== '0'">
            <div class="qrcode">
              <div>
                <img class="qrcodeimg" v-if="data.payQrcode" :src="data.payQrcode" />
                <p>请使用微信扫码支付</p>
              </div>
            </div>
            <div class="records"></div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.msprod {
  border: solid 1px #e4efea;
  border-radius: 15px;
  padding: 15px;
  width: 100%;
  height: 100%;
}

.msprod-active {
  border: solid 2px #fa9321;
}

.vip-popout .shade {
  position: absolute;
  z-index: 10000;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background: #1b1b1f;
  opacity: 0.5;
}

.content {
  position: absolute;
  z-index: 10001;
  top: 15vw;
  left: 25vw;
  width: 50vw;
  max-width: 1080px;
  background: #ffffff;
  opacity: 1;
  border-radius: 15px;
  overflow: hidden;
  color: #5d5d68;
}

.close {
  position: absolute;
  right: 15px;
  top: 15px;
}

.title {
  padding: 15px;
  background-color: #eff0f3;
}

.section {
  width: 90%;
  margin: 0 auto 30px auto;
}

.prods {
  display: flex;
  justify-content: center;
  padding: 15px 0;
  margin: 0px auto;
}

.prod {
  width: 180px;
  margin: 15px;
}

.prod h2 {
  font-weight: bold;
}

.prod .price {
  color: #fa9321;
  margin: 5px 0;
  font-size: 12px;
}

.prod .unitPrice {
}

.prod .unitPrice .amt {
  font-size: 16px;
}

.markPrice {
  margin-left: 5px;
  text-decoration-line: line-through;
  color: #babbbd;
  font-size: 12px;
}

.prod .rights {
  font-size: 14px;
}

.pay {
  border-top: solid 1px #eee;
}

.qrcode {
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 14px;
}

.qrcodeimg {
  width: 200px;
  height: 200px;
  border: solid 1px #e4efea;
  margin: 20px auto;
}
</style>
