/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2021-11-13 10:59:15
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const os = require('os');
const fs = require('fs');
const path = require('path');


/**
 *****************************************
 * 创建软的链接
 *****************************************
 */
fs.symlink(
    path.resolve(__dirname, '../'),
    path.resolve(os.homedir(), '.vscode/extensions/edonet.vscode-command-runner'),
    (err) => {
        err ? console.error(err) : console.log('Symlink successful!')
    }
);
