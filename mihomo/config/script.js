const { name } = $arguments

// 解析 YAML 内容
const yaml = ProxyUtils.yaml.safeLoad($content ?? $files[0])

// 删除 proxy-providers 字段
delete yaml['proxy-providers']

// 获取 ClashMeta 代理对象
let clashMetaProxies = await produceArtifact({
    type: 'collection',
    name: name,
    platform: 'ClashMeta',
    produceType: 'internal'
})

// // 递归删除以 "_" 开头的字段
// function removeUnderscoreFields(obj) {
//     if (Array.isArray(obj)) {
//         return obj.map(removeUnderscoreFields)
//     } else if (typeof obj === 'object' && obj !== null) {
//         const newObj = {}
//         for (const key in obj) {
//             if (!key.startsWith('_')) {
//                 newObj[key] = removeUnderscoreFields(obj[key])
//             }
//         }
//         return newObj
//     }
//     return obj
// }

// clashMetaProxies = removeUnderscoreFields(clashMetaProxies)

// // 给每个代理节点的名字加上序号，格式：01 - 原名
// clashMetaProxies = clashMetaProxies.map((proxy, index) => {
//     // 如果节点名已经有序号前缀了，也可以先去掉或跳过，这里简单加前缀
//     const prefix = `${String(index + 1).padStart(2, '0')} `
//     return {
//         ...proxy,
//         name: prefix + proxy.name
//     }
// })

// 插入代理到 YAML 中
// yaml.proxies = [...clashMetaProxies, ...(yaml.proxies || [])]
yaml.proxies.unshift(...clashMetaProxies)

// 重新转换成 YAML 字符串
$content = ProxyUtils.yaml.dump(yaml)
