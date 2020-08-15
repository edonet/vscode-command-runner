/**
 *****************************************
 * Created by lifx
 * Created on 2018-05-23 20:53:44
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
 * 定义命令对象
 *****************************************
 */
class Command {

    /* 初始化对象 */
    constructor(accessor) {
        this.$$accessor = accessor;
        this.$$regexp = /\$\{(.*?)\}/g;
    }

    /* 选择命令 */
    async showPick() {
        let commands = this.getCommands(),
            keys = Object.keys(commands);

        // 选择执行命令
        if (keys.length) {

            // 过滤默认命令
            if (keys.length > 1) {
                keys = keys.filter(key => key !== 'echo');
            }

            // 显示选择列表
            try {
                let key = await vscode.window.showQuickPick(
                        keys, { placeHolder: 'Type or select command to run' }
                    );

                // 解析命令
                return this.resolve(commands[key]);
            } catch (err) {
                // do nothings;
            }
        }
    }

    /* 解析指定命令 */
    pick(command) {
        return this.resolve(this.getCommands()[command] || command);
    }

    /* 获取命令 */
    getCommands() {

        // 刷新存取器
        this.$$accessor.refresh();

        // 获取配置
        return Object.assign(
            {},
            this.$$accessor.getConfiguration('command-runner.commands'),
            this.$$accessor.getPackageConfiguration('commands')
        );
    }

    /* 解析命令 */
    resolve(command) {
        return command && command.replace(this.$$regexp, (str, $1) => {
            let [variable, args = ''] = $1.split(':');

            // 去除空白
            variable = variable.trim();
            args = args.trim();

            // 解析变量
            switch (variable) {
                case 'config':
                    return args && this.$$accessor.getConfiguration(args);
                case 'env':
                    return args && this.$$accessor.getEnvVariable(args);
                case 'command':
                    args && vscode.commands.executeCommand(args);
                    return '';
                default:
                    return this.$$accessor.getPredefinedVariable(variable);
            }
        });
    }
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = Command;
