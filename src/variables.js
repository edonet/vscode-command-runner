/**
 *****************************************
 * Created by lifx
 * Created on 2018-05-14 22:20:07
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    path = require('path'),
    vscode = require('vscode'),
    match = /\$\{(.*?)\}/g;


/**
 *****************************************
 * 解析变量
 *****************************************
 */
function resolveVariable(str = '', accessor = variableAccessor()) {
    return str.replace(match, (find, $1) => {
        let [variable, args = ''] = $1.split(':');

        // 去除空白
        variable = variable.trim();
        args = args.trim();

        // 解析变量
        switch (variable) {
            case 'config':
                return args && accessor.getConfigurationValue(args);
            case 'env':
                return args && accessor.getEnvVariable(args);
            case 'command':
                args && vscode.commands.executeCommand(args);
                return '';
            default:
                return accessor.getPredefinedVariable(variable);
        }
    });
}


/**
 *****************************************
 * 变量获取
 *****************************************
 */
function variableAccessor() {
    let variables = Object.create(null),
        env = process.env;

    // 返回数据接口
    return {
        getConfigurationValue(section) {
            let folder = this.getActiveFolder();

            if (folder) {
                return vscode.workspace.getConfiguration(section, folder.uri);
            }

            return vscode.workspace.getConfiguration(section, '');
        },
        getActiveEditor() {

            // 获取编辑器
            if (!('activeEditor' in variables)) {
                variables.activeEditor = vscode.window.activeTextEditor || null;
            }

            // 返回编辑器
            return variables.activeEditor;
        },
        getActiveFile() {

            // 获取文件
            if (!('activeFile' in variables)) {
                let editor = this.getActiveEditor();
                variables.activeFile = editor && editor.document;
            }

            // 返回文件
            return variables.activeFile;
        },
        getWorkspaceFolders() {

            // 获取文件夹
            if (!('workspaceFolders' in variables)) {
                variables.workspaceFolders = vscode.workspace.workspaceFolders || [];
            }

            // 返回文件夹
            return variables.workspaceFolders;
        },
        getActiveFolder() {

            // 获取文件夹
            if (!('activeFolder' in variables)) {
                let file = this.getActiveFile();

                // 查找文件目录
                if (file) {
                    variables.activeFolder = vscode.workspace.getWorkspaceFolder(file.uri.fsPath);
                }

                // 返回第一个目录
                variables.activeFolder = this.getWorkspaceFolders()[0];
            }

            // 返回文件夹
            return variables.activeFolder;
        },
        getFolderInfomation(name, folder = this.getActiveFolder()) {
            if (folder) {
                if (!(name in variables)) {
                    let fsPath = folder.uri.fsPath;

                    switch (name) {
                        case 'workspaceFolder':
                            return variables[name] = fsPath;
                        case 'workspaceFolderBasename':
                            return variables[name] = path.basename(fsPath);
                        default:
                            return variables[name] = '';
                    }
                }

                // 返回文件信息
                return variables[name];
            }

            // 返回空
            return '';
        },
        getFileInfomation(name, file = this.getActiveFile()) {
            if (file) {
                if (!(name in variables)) {
                    let fsPath = file.uri.fsPath;

                    switch (name) {
                        case 'file':
                            return variables[name] = fsPath;
                        case 'relativeFile':
                            return variables[name] = path.relative(this.getWorkspaceFolder().uri.fsPath, fsPath);
                        case 'fileBasename':
                            return variables[name] = path.basename(fsPath);
                        case 'fileBasenameNoExtension':
                            return variables[name] = path.basename(fsPath, '.' + path.extname(fsPath));
                        case 'fileDirname':
                            return variables[name] = path.dirname(fsPath);
                        case 'fileExtname':
                            return variables[name] = path.extname(fsPath);
                        default:
                            return variables[name] = '';
                    }
                }

                // 返回文件信息
                return variables[name];
            }

            // 返回空
            return '';
        },
        getPredefinedVariable(name) {
            switch (name) {
                case 'workspaceFolder':
                case 'workspaceFolderBasename':
                    return this.getFolderInfomation(name);
                case 'file':
                case 'relativeFile':
                case 'fileBasename':
                case 'fileBasenameNoExtension':
                case 'fileDirname':
                case 'fileExtname':
                    return this.getFileInfomation(name);
                case 'cwd':
                    return process.cwd();
                default:
                    return '';
            }
        },
        getEnvVariable(name) {
            return env[name.toUpperCase()] || '';
        }
    };
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = { resolveVariable, variableAccessor };
