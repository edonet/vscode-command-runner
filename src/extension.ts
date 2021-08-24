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
        vscode.commands.registerCommand('command-runner.run', async (opts: CommandOptions = {}, files?: vscode.Uri[]) => {
            const command = new Command(context,false);
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
                return await command.execute(command.commands[cmd] || cmd, opts.terminal);
            }

            // 选择命令并执行
            await command.pick();
        })
    );

    // 注册【在终端运行】命令
    context.subscriptions.push(
        vscode.commands.registerCommand('command-runner.runInTerminal', async ({ terminal }: CommandOptions = {}) => {
            const command = new Command(context,false);

            // 兼容终端名参数
            if (typeof terminal === 'string') {
                terminal = { name: terminal };
            }

            // 执行命令
            await command.executeSelectText(terminal);
        })
    );

    //Command to pipe output to extension output
    context.subscriptions.push(
        vscode.commands.registerCommand('command-runner.runToOutput', async (opts: CommandOptions = {}, files?: vscode.Uri[]) => {
            const command = new Command(context,true);
            const cmd = opts.command || opts.cmd || '';

            // 添加选中的文件
            if (files && files.length) {
                files.forEach(argv => command.addFile(argv.fsPath));
            }

            // 执行命令
            if (cmd) {
                return await command.execute(command.commands[cmd] || cmd, undefined);
            }

            // 选择命令并执行
            command.pick();
        })
    );
}
