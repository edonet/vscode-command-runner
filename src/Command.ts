/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-08-15 21:18:39
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
 * 命令执行参数
 *****************************************
 */
export type TerminalOptions = Partial<vscode.TerminalOptions> & {
    autoFocus?: boolean;
    autoClear?: boolean;
};


/**
 *****************************************
 * 命令行工具
 *****************************************
 */
export default class Command {

    /* 执行命令 */
    async execute(cmd: string, options?: TerminalOptions) {
        if (cmd) {
            const { autoClear, autoFocus, ...terminalOptions }: TerminalOptions = {
                ...vscode.workspace.getConfiguration().get('command-runner.terminal'),
                ...options,
                hideFromUser: false,
            };

            // 创建终端
            const terminal = this.createTerminal(terminalOptions);

            // 显示终端
            if (autoFocus && terminal !== vscode.window.activeTerminal) {
                terminal.show();
            }

            // 清空终端
            if (autoClear) {
                await vscode.commands.executeCommand('workbench.action.terminal.clear');
            }

            // 写入命令
            terminal.sendText(cmd);
        }
    }

    /* 创建终端 */
    createTerminal(options: vscode.TerminalOptions) {
        const { window } = vscode;
        const { name } = options;

        // 指定终端
        if (name && typeof name === 'string') {
            return (
                window.terminals.find(term => term.name === name) ||
                window.createTerminal(options)
            );
        }

        // 使用默认终端
        return window.activeTerminal || window.createTerminal(options);
    }
}
