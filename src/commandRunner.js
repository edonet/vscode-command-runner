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
            let hasTerminal = vscode.window.terminals.length;

			if( ! hasTerminal )
			{
                vscode.window.createTerminal({ name: 'Command' });
			}

			if (vscode.window.activeTerminal) {
				vscode.window.activeTerminal.show();
				vscode.window.activeTerminal.sendText(command);
			}


            // 创建终端
            //this.createTerminal(options);

            // 显示终端
            /*if (typeof options === 'object' && options !== null && !options.hideFromUser) {
                this.$$terminal.show(true);
            }

            // 清空终端
            if (hasTerminal) {
                await vscode.commands.executeCommand('workbench.action.terminal.clear');
            }

            // 执行命令
            this.$$terminal.sendText(command);*/

            // 输出命令信息
            console.log('--> Run Command:', command);
        }
    }

    /* 创建终端 */
    /*createTerminal(options) {

        // 新建终端
        if (options === true) {
            return this.$$terminal = vscode.window.createTerminal({ name: 'Command' });
        }

        // 兼容参数
        if (typeof options === 'string') {
            options = { name: options };
        }

        // 创建配置
        if (typeof options === 'object') {
            options = Object.assign({ name: 'Command' }, options);

            // 查找终端
            if (!this.$$terminal || this.$$terminal.name !== options.name) {
                this.$$terminal = vscode.window.terminals.filter(x => x.name === options.name).pop();
            }

            // 创建终端
            if (!this.$$terminal) {
                this.$$terminal = vscode.window.createTerminal(options);
            }
        }
    }*/

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
