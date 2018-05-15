/**
 *****************************************
 * Created by lifx
 * Created on 2018-05-15 12:10:38
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    path = require('path');


/**
 *****************************************
 * 获取包配置
 *****************************************
 */
module.exports = function getPackageConfig(name, config = {}, folders = []) {

    // 获取包配置
    folders.forEach(folder => {
        try {
            let dir = path.join(folder.uri.fsPath, 'package.json'),
                settings = require(dir);

            // 合并配置
            config = Object.assign({}, config, settings[name]);
        } catch (err) {
            // do nothings;
        }
    });

    // 返回配置
    return config;
};
