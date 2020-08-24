/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-08-22 16:24:52
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 生成缓存对象
 *****************************************
 */
export default function cache<T extends object>(target: T): T {
    const cached: Record<string, unknown> = Object.create(null);
    const proxy: T = Object.create(target);

    // 遍历属性
    Object.keys(target).forEach(key => {
        const handler = target[key as keyof T];

        // 代理函数
        if (typeof handler === 'function') {
            Object.defineProperty(proxy, key, {
                value: (...args: unknown[]) => {
                    if (key in cached) {
                        return cached[key];
                    }

                    // 即时取值
                    return cached[key] = handler.apply(proxy, args);
                },
            });
        }
    });

    // 返回代理对象
    return proxy;
}
