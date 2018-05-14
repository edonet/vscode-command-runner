/**
 *****************************************
 * Created by lifx
 * Created on 2018-05-14 17:10:40
 *****************************************
 */
'use strict';

/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    vscode = require('vscode'),
    utils = require('./utils');


/**
 *****************************************
 * 激活扩展
 *****************************************
 */
function activate(context) {

    // 注册【命令运行】命令
    context.subscriptions.push(
        vscode.commands.registerCommand('command-runner.run', runCommand)
    );
}

/**
 *****************************************
 * 退出激活状态
 *****************************************
 */
function deactivate() {
    // do some things;
}


/**
 *****************************************
 * 执行命令
 *****************************************
 */
function runCommand() {
    let folders = utils.getWorkspaceFolders(),
        file = utils.getActiveDocument(),
        commands = utils.getConfig('command-runner', 'commands', folders),
        keys = Object.keys(commands);

    console.log(Object.keys(vscode));
    console.log(commands, keys, folders, file, utils.getRootFolder());
    vscode.window.showQuickPick(keys, { placeHolder: 'Type or select command to run' }).then(key => {
        console.log(key);
    });
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = { activate, deactivate };
