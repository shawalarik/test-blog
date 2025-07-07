// utils/isEmpty.js
/**
 * 检查值是否为空（支持多种类型）
 * @param {any} value - 待检查的值
 * @returns {boolean} - 如果值为空返回 true，否则返回 false
 */
export function isEmpty(value: Object) {
    // 处理 null 和 undefined
    if (value === null || value === undefined) {
        return true;
    }

    // 处理字符串（包括纯空格字符串）
    if (typeof value === 'string') {
        return value.trim().length === 0;
    }

    // 处理数组
    if (Array.isArray(value)) {
        return value.length === 0;
    }

    // 处理对象
    if (typeof value === 'object') {
        // 特殊处理 Date 对象
        if (value instanceof Date) {
            return false;
        }

        // 处理 Set 和 Map
        if (value instanceof Set || value instanceof Map) {
            return value.size === 0;
        }

        // 处理普通对象和类对象
        return Object.keys(value).length === 0;
    }

    // 其他情况（数字、布尔值、函数等）
    return false;
}

export function isNotEmpty(value: Object) {
    return !isEmpty(value)
}
