/**
 *****************************************
 * Created by lifx
 * Created on 2018-05-23 19:53:46
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
 * 定义命令运行器
 *****************************************
 */
class CommandRunner {

    /* 初始化对象 */
    constructor() {
        this.$$terminal = null;
        this.$$disposable = this.subscribe();
    }

    /* 绑定事件 */
    subscribe() {
        let subscriptions = [],
            listener = terminal => {
                if (terminal === this.$$terminal) {
                    this.$$terminal = null;
                }
            };

        // 监听终端关闭事件
        vscode.window.onDidCloseTerminal(listener, this, subscriptions);

        // 返回监听器
        return vscode.Disposable.from(subscriptions[0]);
    }

    /* 执行命令 */
    async execute(command, options = {}) {
        if (command) {

            // 创建终端
            if (!this.$$terminal) {
                this.$$terminal = vscode.window.createTerminal(Object.assign({ name: 'Command' }, options));
            }

            // 显示终端
            this.$$terminal.show(true);

            // 清空终端
            await vscode.commands.executeCommand('workbench.action.terminal.clear');

            // 执行命令
            this.$$terminal.sendText(command);

            // 输出命令信息
            console.log('--> Run Command:', command);
        }
    }

    /* 销毁对象 */
    dispose() {
        this.$$disposable.dispose();
    }
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = CommandRunner;
