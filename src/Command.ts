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
import replace from './helpers/replace';
import Accessor, { VariableScope } from './Accessor';

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
 * 创建终端
 *****************************************
 */
function createTerminal(options: vscode.TerminalOptions) {
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


/**
 *****************************************
 * 命令行工具
 *****************************************
 */
export default class Command {

    /* 选中的文件列表 */
    private $files: string[] = [];

    /* 存取器 */
    private $accessor = new Accessor();

    /* 获取命令 */
    get commands() {
        return this.$accessor.commands();
    }

    /* 添加文件 */
    addFile(file?: string) {
        file && this.$files.push(JSON.stringify(file));
    }

    /* 解析命令 */
    async resolve(cmd: string): Promise<string> {
        return cmd && replace(cmd, async str => {
            let [variable, args = ''] = str.split(':');

            // 去除空白
            variable = variable.trim();
            args = args.trim();

            // 解析变量
            switch (variable) {
                case 'config':
                    return args && this.$accessor.config(args) as string;
                case 'env':
                    return args && this.$accessor.env(args);
                case 'input':
                    return await this.$accessor.input(args) || args;
                case 'command':
                    args && vscode.commands.executeCommand(args);
                    return '';
                default:
                    return this.$accessor.variable(variable as VariableScope);
            }
        });
    }

    /* 选择命令并执行 */
    async pick(options?: TerminalOptions) {
        const commands = this.$accessor.commands();
        const keys = Object.keys(commands).filter(
            key => key !== 'echo' || commands[key] !== 'echo \'this is a test command: ${file}\''
        );

        // 命令列表为空
        if (!keys.length) {
            return;
        }

        // 显示选择列表
        try {
            const cmd = await vscode.window.showQuickPick(
                keys, { placeHolder: 'Type or select command to run' }
            );

            // 执行命令
            if (cmd) {
                await this.execute(commands[cmd], options);
            }
        } catch (err) {
            // do nothings;
        }
    }

    /* 执行命令 */
    async execute(cmd: string, options?: TerminalOptions) {
        const { autoClear, autoFocus, ...terminalOptions }: TerminalOptions = {
            ...this.$accessor.config('command-runner.terminal'),
            ...options,
            hideFromUser: false,
        };

        // 创建终端
        const terminal = createTerminal(terminalOptions);

        // 显示终端
        if (autoFocus && terminal !== vscode.window.activeTerminal) {
            terminal.show();
        }

        // 清空终端
        if (autoClear) {
            await vscode.commands.executeCommand('workbench.action.terminal.clear');
        }

        // 获取命令
        const command = cmd + ' ' + this.$files.join(' ');

        // 写入命令
        terminal.sendText(await this.resolve(command));

        // 输出命令信息
        console.log('--> Run Command:', command);
    }

    /* 执行选择的文字 */
    async executeSelectText(options?: TerminalOptions) {
        await this.execute(this.$accessor.variable('selectedTextSection'), options);
    }
}
