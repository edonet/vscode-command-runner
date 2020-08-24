/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-08-16 10:34:32
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import variable from './helpers/variable';


/**
 *****************************************
 * 变量名
 *****************************************
 */
export const variableMap = {
    file: 1,
    fileBasename: 1,
    fileBasenameNoExtension: 1,
    fileDirname: 1,
    fileExtname: 1,
    lineNumber: 1,
    lineNumbers: 1,
    selectedText: 1,
    selectedTextList: 1,
    selectedTextSection: 1,
    selectedPosition: 1,
    selectedPositionList: 1,
    relativeFile: 1,
    workspaceFolder: 1,
    workspaceFolderBasename: 1,
    homedir: 1,
    tmpdir: 1,
    platform: 1,
};


/**
 *****************************************
 * 变量类型
 *****************************************
 */
export type VariableScope = keyof typeof variableMap;


/**
 *****************************************
 * 存取器
 *****************************************
 */
export default class Accessor {

    /* 变量缓存对象 */
    private $variable = variable();

    /* 获取环境变量 */
    env(scope: string): string {
        return this.$variable.env()[scope.toUpperCase()] || '';
    }

    /* 获取配置 */
    config<T = unknown>(scope: string): T | undefined {
        return this.$variable.config().get(scope);
    }

    /* 获取包配置 */
    package<T = unknown>(scope: string): T | undefined {
        return this.$variable.package()[scope] as T;
    }

    /* 获取变量 */
    variable(scope: VariableScope): string {
        return variableMap[scope] === 1 ? this.$variable[scope]() : '';
    }

    /* 获取命令 */
    command(name: string): string {
        return this.$variable.commands()[name] || name;
    }

    /* 获取命令集 */
    commands(): Record<string, string> {
        return this.$variable.commands();
    }
}
