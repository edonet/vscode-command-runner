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
    Accessor = require('./accessor'),
    Command = require('./command'),
    CommandRunner = require('./commandRunner');


/**
 *****************************************
 * 激活扩展
 *****************************************
 */
function activate(context) {
    let accessor = new Accessor(),
        command = new Command(accessor),
        commandRunner = new CommandRunner();

    // 添加事件监听
    context.subscriptions.push(commandRunner);

    // 注册【命令运行】命令
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'command-runner.run',
            () => command.showPick().then(cmd => commandRunner.execute(cmd))
        )
    );
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = { activate };
