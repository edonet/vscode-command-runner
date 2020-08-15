/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-05-30 20:05:28
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import * as vscode from 'vscode';


/**
 *****************************************
 * 激活扩展
 *****************************************
 */
export function activate(context: vscode.ExtensionContext) {

    // 注册【运行】命令
    context.subscriptions.push(
        vscode.commands.registerCommand('command-runner.run', (args) => {
            console.log(args);
        })
    );

    // 注册【在终端运行】命令
    context.subscriptions.push(
        vscode.commands.registerCommand('command-runner.runInTerminal', () => {

        })
    );
}
