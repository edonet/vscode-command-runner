/**
 *****************************************
 * Created by lifx
 * Created on 2018-05-14 18:56:58
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
    vscode = require('vscode');


/**
 *****************************************
 * 获取配置
 *****************************************
 */
function getConfig(section, name, root = []) {
    return root.reduce(
        (res, dir) => Object.assign({}, res, getPackageConfig(dir, name)),
        vscode.workspace.getConfiguration(section)[name] || {}
    );
}


/**
 *****************************************
 * 获取包文件配置
 *****************************************
 */
function getPackageConfig(dir, name = '') {
    let packageConfig = {};

    try {
        packageConfig = require(path.join(dir, 'package.json')) || {};
    } catch (err) {
        // do nothing;
    }

    // 返回空对象
    return name ? packageConfig[name] || {} : packageConfig;
}


/**
 *****************************************
 * 获取根文件夹
 *****************************************
 */
function getWorkspaceFolders() {
    return (vscode.workspace.workspaceFolders || []).map(
        folder => folder.uri.fsPath
    );
}


/**
 *****************************************
 * 获取文件根目录
 *****************************************
 */
function getRootFolder(file = getActiveDocument(), folders = getWorkspaceFolders()) {
    if (folders) {
        if (file) {
            let root = vscode.workspace.getWorkspaceFolder(file);

            if (root) {
                return root.uri.fsPath;
            }
        }

        return folders[0];
    }
}


/**
 *****************************************
 * 获取当前文件
 *****************************************
 */
function getActiveDocument() {
    let editor = vscode.window.activeTextEditor || {},
        doc = editor.document;

    // 返回文件路径
    return doc && doc.uri.fsPath;
}


/**
 *****************************************
 * 返回接口
 *****************************************
 */
module.exports = {
    getConfig,
    getWorkspaceFolders,
    getRootFolder,
    getActiveDocument
};
