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
        vscode.commands.registerCommand('command-runner.run', (opts: CommandOptions = {}, files?: vscode.Uri[]) => {
            const command = new Command();
            const cmd = opts.command || opts.cmd || '';

            // 兼容终端名参数
            if (typeof opts.terminal === 'string') {
                opts.terminal = { name: opts.terminal };
            }

            // 添加选中的文件
            if (files && files.length) {
                files.forEach(argv => command.addFile(argv.fsPath));
            }

            // 执行命令
            if (cmd) {
                return command.execute(command.commands[cmd] || cmd, opts.terminal);
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
