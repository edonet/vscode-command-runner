/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-09-05 11:23:10
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 定义匹配项
 *****************************************
 */
const regexp = /\$\{(.*?)\}/g;


/**
 *****************************************
 * 失败内容
 *****************************************
 */
async function replace(str: string, handler: (matched: string) => string | Promise<string>): Promise<string> {
    if (str) {
        let matched = regexp.exec(str);
        let result = '';
        let idx = 0;

        // 匹配成功
        while (matched) {

            // 添加结果
            result += str.slice(idx, matched.index);

            // 添加值
            result += await handler(matched[1]) || '';

            // 更新位置
            idx = matched.index + matched[0].length;

            // 匹配下一项
            matched = regexp.exec(str);
        }

        // 返回结果
        return result + str.slice(idx);
    }

    // 返回默认值
    return str;
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
export default replace;
