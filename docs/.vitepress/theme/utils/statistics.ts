import { isNotEmpty, isEmpty, getLocationInfo } from "./WwUtils";

let isInit = true;
let ipInfo = {};

const init = async () => {
  if (isInit) {
    ipInfo = await getLocationInfo();
    isInit = false;
  }
  console.log("ipInfo", ipInfo);
  return ipInfo;
};

/**
 * 发送统计信息
 * @param router 路由实例
 * @param siteData 站点信息
 * @param visitorId 访客ID
 */
const sendVisitStatistics = async (router, siteData, visitorId) => {
  //console.log("sendVisitStatistics - router", router)
  //console.log("sendVisitStatistics - siteData", siteData)

  //console.log(JSON.stringify(siteData._rawValue))
  const route = router.route;
  // @ts-ignore-error
  const siteId = import.meta.env.SITE_ID || "YOUR_SITE_ID"; // 替换为您的网站ID
  const pageUrl = route.path; // VitePress 提供的相对路径
  const pageTitle = isNotEmpty(route.data.title) ? route.data.title : siteData._rawValue.title;
  const relativePath = route.data.relativePath;
  let permalink = route.data.frontmatter.permalink;

  if (pageTitle === "404") {
    return;
  }

  if (isEmpty(permalink)) {
    permalink = "/";
  }

  /*    console.log("pageUrl", pageUrl, "pageTitle", pageTitle)
    console.log("relativePath", route.data.relativePath)
    console.log("permalink", route.data.frontmatter.permalink)*/

  const windowPageUrl = window.location.pathname;

  const locationInfo = await init();

  // 构建统计数据
  const visitData = {
    siteId,
    visitorId,
    pageTitle,
    pageUrl: permalink,
    relativePath,
    locationInfo,
  };

  const data = JSON.stringify(visitData);
  console.log("记录信息", data);

  // 发送POST请求到统计API
  // @ts-ignore-error
  fetch(import.meta.env.VISIT_URL || "/api/visit/record", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  }).catch(error => {
    console.error("统计数据发送失败:", error);
  });
};

export default sendVisitStatistics;
