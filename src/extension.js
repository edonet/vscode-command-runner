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

    // 注册【运行】命令
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'command-runner.run',
            (args = {}) => {

                // 刷新存取器
                accessor.refresh();

                // 执行指定命令
                if (args.command || args.cmd) {
                    return commandRunner.execute(command.pick(args.command || args.cmd), args.terminal);
                }

                // 选择命令
                command.showPick().then(cmd => commandRunner.execute(cmd, args.terminal));
            }
        )
    );

    // 注册【在终端运行】命令
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'command-runner.runInTerminal',
            (args = {}) => {
                let cmd = accessor.getSectionInfomation('selectedText');

                // 刷新存取器
                accessor.refresh();

                // 运行命令
                commandRunner.execute(command.resolve(cmd), args.terminal);
            }
        )
    );
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = { activate };
