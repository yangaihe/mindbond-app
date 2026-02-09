import { isObject } from '@vue/shared'

/**
 * @description 获取元素节点信息（在组件中的元素必须要传ctx）
 * @param  { String } selector 选择器 '.app' | '#app'
 * @param  { Boolean } all 是否多选
 * @param  { ctx } context 当前组件实例
 */
export const getRect = (selector: string, all = false, context?: any) => {
    return new Promise((resolve, reject) => {
        let query = uni.createSelectorQuery()
        if (context) {
            query = uni.createSelectorQuery().in(context)
        }
        query[all ? 'selectAll' : 'select'](selector)
            .boundingClientRect(function (rect) {
                if (all && Array.isArray(rect) && rect.length) {
                    return resolve(rect)
                }
                if (!all && rect) {
                    return resolve(rect)
                }
                reject('找不到元素')
            })
            .exec()
    })
}

/**
 * @description 获取当前页面实例
 */
export function currentPage() {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    return currentPage || {}
}

/**
 * @description 后台选择链接专用跳转
 */
interface Link {
    path: string
    name?: string
    type: string
    isTab: boolean
    query?: Record<string, any>
}

export enum LinkTypeEnum {
    'SHOP_PAGES' = 'shop',
    'CUSTOM_LINK' = 'custom'
}

export function navigateTo(link: Link, navigateType: 'navigateTo' | 'reLaunch' = 'navigateTo') {
    const url = link.query ? `${link.path}?${objectToQuery(link.query)}` : link.path
    navigateType == 'navigateTo' && uni.navigateTo({ url })
    navigateType == 'reLaunch' && uni.reLaunch({ url })
}

/**
 * @description 是否为空
 * @param {unknown} value
 * @return {Boolean}
 */
export const isEmpty = (value: unknown) => {
    return value == null && typeof value == 'undefined'
}

/**
 * @description 对象格式化为Query语法
 * @param { Object } params
 * @return {string} Query语法
 */
export function objectToQuery(params: Record<string, any>): string {
    let query = ''
    for (const props of Object.keys(params)) {
        const value = params[props]
        const part = encodeURIComponent(props) + '='
        if (!isEmpty(value)) {
            console.log(encodeURIComponent(props), isObject(value))
            if (isObject(value)) {
                for (const key of Object.keys(value)) {
                    if (!isEmpty(value[key])) {
                        const params = props + '[' + key + ']'
                        const subPart = encodeURIComponent(params) + '='
                        query += subPart + encodeURIComponent(value[key]) + '&'
                    }
                }
            } else {
                query += part + encodeURIComponent(value) + '&'
            }
        }
    }
    return query.slice(0, -1)
}

/**
 * @description 格式化输出价格
 * @param  { string } price 价格
 * @param  { string } take 小数点操作
 * @param  { string } prec 小数位补
 */
export function formatPrice({ price, take = 'all', prec = undefined }: any) {
    let [integer, decimals = ''] = (price + '').split('.')

    // 小数位补
    if (prec !== undefined) {
        const LEN = decimals.length
        for (let i = prec - LEN; i > 0; --i) decimals += '0'
        decimals = decimals.substr(0, prec)
    }

    switch (take) {
        case 'int':
            return integer
        case 'dec':
            return decimals
        case 'all':
            return integer + '.' + decimals
    }
}


/**
 * @description 组合异步任务
 * @param  { string } task 异步任务
 */

export function series(...task: Array<(_arg: any) => any>) {
    return function (): Promise<any> {
        return new Promise((resolve, reject) => {
            const iteratorTask = task.values()
            const next = (res?: any) => {
                const nextTask = iteratorTask.next()
                if (nextTask.done) {
                    resolve(res)
                } else {
                    Promise.resolve(nextTask.value(res)).then(next).catch(reject)
                }
            }
            next()
        })
    }
}

/**
 * @description 添加单位
 * @param {String | Number} value 值 100
 * @param {String} unit 单位 px em rem
 */
export const addUnit = (value: string | number, unit = 'rpx') => {
    return !Object.is(Number(value), NaN) ? `${value}${unit}` : value
}

// 格式化时间为 mm:ss
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDate = (date: Date | string | number, format = 'yyyy-MM-dd HH:mm:ss', isDescDay = true): string => {
  date = new Date(date)
  // 判断今天、昨天、前天
  const today = new Date();
  
  // 确保date是一个有效的Date对象
  let targetDate: Date;
  if (date instanceof Date) {
    targetDate = date;
  } else if (typeof date === 'string' || typeof date === 'number') {
    targetDate = new Date(date);
  } else {
    // 如果输入类型无效，返回当前日期的格式化结果
    targetDate = today;
  }
  
  // 检查targetDate是否有效
  if (isNaN(targetDate.getTime())) {
    targetDate = today;
  }
  
  // 计算两个日期之间的天数差
  const timeDiff = today.getTime() - targetDate.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  
  // 确保只比较日期部分，排除时间因素
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const targetDateOnly = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const exactDayDiff = Math.floor((todayDate.getTime() - targetDateOnly.getTime()) / (1000 * 3600 * 24));
  
  if(isDescDay){
    if (exactDayDiff === 0) {
        // 今天
        return '今天';
    } else if (exactDayDiff === 1) {
        // 昨天
        return '昨天';
    } else if (exactDayDiff === 2) {
        // 前天
        return '前天';
    }  
  }
  
  // 其他日期按指定格式返回
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return format.replace('yyyy', year+'').replace('MM', month).replace('dd', day).replace('HH', hour).replace('mm', minute).replace('ss', second);
};

export const formatDayDiff = (day1: string, day2: string): number => {
  // 将日期字符串转换为Date对象
  const date1 = new Date(day1);
  const date2 = new Date(day2);
  
  // 检查日期是否有效
  if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
    console.error('Invalid date input');
    return 0;
  }
  
  // 计算两个日期之间的天数差
  // 先将两个日期转换为同一天的开始（00:00:00），避免时间部分的影响
  const startOfDay1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const startOfDay2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  
  // 计算毫秒数差
  const timeDiff = Math.abs(startOfDay1.getTime() - startOfDay2.getTime());
  
  // 将毫秒数转换为天数
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  return dayDiff;
}