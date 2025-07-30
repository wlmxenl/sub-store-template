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

// 递归删除以 "_" 开头的内部字段
function removeUnderscoreFields(obj) {
    if (Array.isArray(obj)) {
        return obj.map(removeUnderscoreFields)
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj = {}
        for (const key in obj) {
            if (!key.startsWith('_')) {
                newObj[key] = removeUnderscoreFields(obj[key])
            }
        }
        return newObj
    }
    return obj
}

clashMetaProxies = removeUnderscoreFields(clashMetaProxies)

// 插入代理到 YAML 中
yaml.proxies = [...clashMetaProxies, ...(yaml.proxies || [])]

// 重新转换成 YAML 字符串
$content = ProxyUtils.yaml.dump(yaml)
