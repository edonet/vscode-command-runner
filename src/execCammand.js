/**
 *****************************************
 * Created by lifx
 * Created on 2018-05-15 11:33:41
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const vscode = require('vscode');


/**
 *****************************************
 * 获取终端
 *****************************************
 */
let terminal = null;


/**
 *****************************************
 * 执行终端命令
 *****************************************
 */
module.exports = async function executeCommandInTerminal(command) {
    if (command) {

        // 获取终端
        if (!terminal) {
            terminal = vscode.window.createTerminal('Command');
        }

        // 清空终端
        await vscode.commands.executeCommand('workbench.action.terminal.clear');

        // 打印信息
        console.log('--> Run Command:', command);

        // 执行命令
        terminal.show(true);
        terminal.sendText(command);
    }
};
