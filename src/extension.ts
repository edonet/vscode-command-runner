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
import Command, { TerminalOptions } from './Command';


/**
 *****************************************
 * 命令配置
 *****************************************
 */
export interface CommandOptions {
    cmd?: string;
    command?: string;
    terminal?: string | TerminalOptions;
}


/**
 *****************************************
 * 激活扩展
 *****************************************
 */
export function activate(context: vscode.ExtensionContext): void {

    // 注册【运行】命令
    context.subscriptions.push(
        vscode.commands.registerCommand('command-runner.run', (options: CommandOptions = {}) => {
            const command = new Command();
            const cmd = options.command || options.cmd || '';

            // 兼容终端名参数
            if (typeof options.terminal === 'string') {
                options.terminal = { name: options.terminal };
            }

            // 执行命令
            if (cmd) {
                return command.execute(cmd, options.terminal);
            }

            // 选择命令并执行
            command.pick();
        })
    );

    // 注册【在终端运行】命令
    context.subscriptions.push(
        vscode.commands.registerCommand('command-runner.runInTerminal', ({ terminal }: CommandOptions = {}) => {
            const command = new Command();

            // 兼容终端名参数
            if (typeof terminal === 'string') {
                terminal = { name: terminal };
            }

            // 执行命令
            command.executeSelectText(terminal);
        })
    );
}
