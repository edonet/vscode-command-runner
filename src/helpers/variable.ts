/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-08-22 16:40:26
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import cache from './cache';


/**
 *****************************************
 * 生成变量缓存
 *****************************************
 */
export default () => cache({

    /* 获取配置 */
    config() {
        const document = this.document();

        // 文档配置
        if (document) {
            return vscode.workspace.getConfiguration(undefined, document.uri);
        }

        // 默认配置
        return vscode.workspace.getConfiguration();
    },

    /* 获取包配置 */
    package() {
        const workspaceFolder = this.workspaceFolder();
        const packageFile = workspaceFolder ? path.join(workspaceFolder, 'package.json') : '';

        // 加载配置
        if (packageFile) {
            try {
                return JSON.parse(fs.readFileSync(packageFile, 'utf8')) as Record<string, unknown>;
            } catch (err) {
                // do nothing;
            }
        }

        // 返回结果
        return {} as Record<string, unknown>;
    },

    /* 获取环境变量 */
    env() {
        const env = process.env;
        const map: Record<string, string> = Object.create(null);

        // 生成映射
        Object.keys(env).forEach(key => map[key.toUpperCase()] = env[key] || '');

        // 返回对象
        return map;
    },

    /* 当前工作空间 */
    workspace() {
        return vscode.workspace;
    },

    /* 当前窗口 */
    window() {
        return vscode.window;
    },

    /* 当前编辑器 */
    editor() {
        return this.window().activeTextEditor;
    },

    /* 当前文档 */
    document() {
        return this.editor()?.document;
    },

    /* 当前选择内容集 */
    selections() {
        return this.editor()?.selections.sort(
            (sl1, sl2) => sl1.active.line > sl2.active.line ? 1 : -1
        );
    },

    /* 当前文件 */
    file(): string {
        return this.document()?.uri.fsPath || '';
    },

    /* 当前文件名 */
    fileBasename(): string {
        return this.file() && path.basename(this.file());
    },

    /* 当前文件名去除扩展名 */
    fileBasenameNoExtension(): string {
        return this.file() && path.basename(this.file(), this.fileExtname());
    },

    /* 当前文件目录 */
    fileDirname(): string {
        return this.file() && path.dirname(this.file());
    },

    /* 当前文件扩展名 */
    fileExtname(): string {
        return this.file() && path.extname(this.file());
    },

    /* 当前文件相对路径 */
    relativeFile(): string {
        return vscode.workspace.asRelativePath(this.file());
    },

    /* 当前行 */
    lineNumber(): string {
        const [sl] = this.selections() || [];

        // 存在选项
        if (sl) {
            return sl.active.line + 1 + '';
        }

        // 返回空
        return '';
    },

    /* 当前多行 */
    lineNumbers(): string {
        const selections = this.selections();

        // 存在选项
        if (selections && selections.length) {
            return selections.map(sl => sl.active.line + 1).join();
        }

        // 返回空
        return '';
    },

    /* 当前选择的位置 */
    selectedPosition(): string {
        const [sl] = this.selections() || [];

        // 存在选项
        if (sl) {
            return [sl.active.line + 1, sl.active.character].join();
        }

        // 返回空
        return '';
    },

    /* 当前选择的位置列表 */
    selectedPositionList(): string {
        const selections = this.selections();

        // 存在选项
        if (selections && selections.length) {
            return selections.map(sl => [sl.active.line + 1, sl.active.character].join(',')).join(' ');
        }

        // 返回空
        return '';
    },

    /* 当前选择的文字内容 */
    selectedText(): string {
        const [sl] = this.selections() || [];

        // 存在选区
        if (sl && !sl.isEmpty) {
            return this.document()?.getText(sl) || '';
        }

        // 返回空
        return '';
    },

    /* 当前选择文字列表 */
    selectedTextList(): string {
        const document = this.document();
        const selections = this.selections();

        // 存在选项
        if (selections && selections.length && document) {
            return selections.map(sl => document.getText(sl)).join(' ');
        }

        // 返回空
        return '';
    },

    /* 当前选择文字列表 */
    selectedTextSection(): string {
        const document = this.document();
        const selections = this.selections();

        // 存在选项
        if (selections && selections.length && document) {
            return selections.map(sl => document.getText(sl)).join('\n');
        }

        // 返回空
        return '';
    },

    /* 当前工作目录 */
    workspaceFolder(): string {
        const workspace = this.workspace();
        const document = this.document();
        const workspaceFolder = (
            document ?
            workspace.getWorkspaceFolder(document.uri) :
            workspace.workspaceFolders ?
            workspace.workspaceFolders[0] :
            undefined
        );

        // 返回结果
        return workspaceFolder ? workspaceFolder.uri.fsPath : '';
    },

    /* 当前工作目录文件夹名称 */
    workspaceFolderBasename(): string {
        return this.workspaceFolder() && path.basename(this.workspaceFolder());
    },

    /* 系统用户目录 */
    homedir(): string {
        return os.homedir();
    },

    /* 系统临时目录 */
    tmpdir(): string {
        return os.tmpdir();
    },

    /* 系统平台 */
    platform(): string {
        return os.platform();
    },

    /* 命令集 */
    commands(): Record<string, string> {
        return {
            ...this.config().get('command-runner.commands'),
            ...this.package()['commands'] as object,
        };
    },
});
