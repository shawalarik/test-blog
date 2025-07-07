import {toRef, unref, isRef, isProxy, toRaw} from "vue";
import {isNotEmpty, isEmpty} from "./WwUtils"
import { useData } from 'vitepress'


const sendVisitStatistics = (router, siteData) => {


    console.log("sendVisitStatistics - router", router)
    console.log("sendVisitStatistics - siteData", siteData)

    //console.log(JSON.stringify(siteData._rawValue))
    const route = router.route

    const siteId = 'YOUR_SITE_ID' // 替换为您的网站ID
    const pageUrl = route.path // VitePress 提供的相对路径
    const pageTitle = isNotEmpty(route.data.title) ? route.data.title : siteData._rawValue.title
    const relativePath = route.data.relativePath
    let permalink = route.data.frontmatter.permalink

    if (pageTitle === '404'){
        return
    }

    if (isEmpty(permalink)){
        permalink = "/"
    }


/*    console.log("pageUrl", pageUrl, "pageTitle", pageTitle)
    console.log("relativePath", route.data.relativePath)
    console.log("permalink", route.data.frontmatter.permalink)*/

    // 生成或获取访问者ID (使用localStorage存储)
    let visitorId = localStorage.getItem('visitor_id')
    if (!visitorId) {
        visitorId = generateUUID()
        localStorage.setItem('visitor_id', visitorId)
    }

    const windowPageUrl = window.location.pathname

    // 构建统计数据
    const visitData = {
        siteId,
        visitorId,
        pageTitle,
        pageUrl: permalink,
        relativePath,
        referer: document.referrer
    }

    const data = JSON.stringify(visitData)
    console.log("data", data)

    // 发送POST请求到统计API
    fetch('/api/visit/record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    }).catch(error => {
        console.error('统计数据发送失败:', error)
    })
}

// 生成UUID
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

export default sendVisitStatistics
