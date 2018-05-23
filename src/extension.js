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
    getPackageConfig = require('./getPackageConfig'),
    execCommand = require('./execCammand'),
    { resolveVariable, variableAccessor } = require('./variables');


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
 * 执行命令
 *****************************************
 */
function runCommand() {
    let accessor = variableAccessor(),
        folders = accessor.getWorkspaceFolders(),
        config = accessor.getConfigurationValue('command-runner'),
        commands = getPackageConfig('commands', config.get('commands'), folders),
        pick;


    // 显示下拉选择列表
    pick = vscode.window.showQuickPick(
        Object.keys(commands), { placeHolder: 'Type or select command to run' }
    );

    // 执行选择的命令
    pick.then(key => execCommand(resolveVariable(commands[key], accessor)));
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = { activate };
