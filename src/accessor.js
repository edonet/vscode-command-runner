/**
 *****************************************
 * Created by lifx
 * Created on 2018-05-23 21:37:16
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    os = require('os'),
    path = require('path'),
    vscode = require('vscode');


/**
 *****************************************
 * 存取器
 *****************************************
 */
class Accessor {

    /* 初始化对象 */
    constructor() {
        this.$$env = this.createEnvVariable();
        this.workspaceFolders = [];
        this.workspaceFolder = null;
        this.activeEditor = null;
        this.activeFile = null;
        this.config = null;
    }

    // 刷新存取器
    refresh() {
        let workspace = vscode.workspace;

        // 获取当前文件
        this.workspaceFolders = workspace.workspaceFolders || [];
        this.activeEditor = vscode.window.activeTextEditor || null;
        this.activeFile = this.activeEditor && this.activeEditor.document;

        // 获取当前工作目录
        this.workspaceFolder = (
            this.activeFile ?
            workspace.getWorkspaceFolder(this.activeFile.uri) :
            this.workspaceFolders[0]
        );

        // 获取配置
        this.config = workspace.getConfiguration(
            undefined, this.activeFile ? this.activeFile.uri : undefined
        );
    }

    /* 获取配置信息 */
    getConfiguration(section) {
        return (
            this.config ?
            (section ? this.config.get(section) : this.config) :
            (section ? undefined : {})
        );
    }

    /* 获取包配置 */
    getPackageConfiguration(name) {

        // 获取目录配置
        if (this.workspaceFolders.length) {
            let config = {};

            // 获取配置
            this.workspaceFolders.forEach(folder => {
                let dir = path.join(folder.uri.fsPath, 'package.json'),
                    settings = require(dir);

                // 合并配置
                config = Object.assign({}, config, name ? settings[name] : settings);
            });

            // 返回配置
            return config;
        }

        // 返回默认
        return name ? undefined : {};
    }

    /* 获取环境变量 */
    getEnvVariable(name) {
        return name ? this.formatPath(this.$$env[name.toUpperCase()]) : this.$$env;
    }

    /* 获取环境变量 */
    createEnvVariable(name) {
        let env = process.env,
            mapper = {};

        // 生成映射
        Object.keys(env).forEach(key => mapper[key.toUpperCase()] = env[key]);

        // 返回对象
        return mapper;
    }

    /* 获取预定义变量 */
    getPredefinedVariable(name) {
        return name ? (
            this.getFileInfomation(name) ||
            this.getWorkspaceInfomation(name) ||
            this.getOSInfomation(name)
        ) : '';
    }

    /* 获取文件夹信息 */
    getWorkspaceInfomation(name, folder = this.workspaceFolder) {

        // 获取文件信息
        if (folder) {
            let dir = folder.uri ? folder.uri.fsPath : file;

            switch (name) {
                case 'workspaceFolder':
                    return this.formatPath(dir);
                case 'workspaceFolderBasename':
                    return this.formatPath(path.basename(dir));
                default:
                    return '';
            }
        }

        // 返回空
        return '';
    }

    /* 获取文件信息 */
    getFileInfomation(name, file = this.activeFile) {

        // 获取文件信息
        if (file) {
            let dir = file.uri ? file.uri.fsPath : file;

            switch (name) {
                case 'file':
                    return this.formatPath(dir);
                case 'relativeFile':
                    return this.formatPath(vscode.workspace.asRelativePath(dir));
                case 'fileBasename':
                    return this.formatPath(path.basename(dir));
                case 'fileBasenameNoExtension':
                    return this.formatPath(path.basename(dir, path.extname(dir)));
                case 'fileDirname':
                    return this.formatPath(path.dirname(dir));
                case 'fileExtname':
                    return this.formatPath(path.extname(dir));
                default:
                    return '';
            }
        }

        // 返回空
        return '';
    }

    /* 获取系统信息 */
    getOSInfomation(name) {
        switch (name) {
            case 'homedir':
                return this.formatPath(os.homedir());
            case 'tmpdir':
                return this.formatPath(os.tmpdir());
            default:
                return '';
        }
    }

    /* 格式化字符串 */
    formatPath(str) {
        return (
            str && typeof str === 'string' ? str.replace(/\s/g, '\\ ') : str
        );
    }
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = Accessor;
