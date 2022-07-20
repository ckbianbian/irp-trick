'use strict';
const fs = require('fire-fs');
const FsExtra = require('fs-extra');
const Path = require('fire-path');
const Electron = require('electron');
const PATH = require('path')
const child_process = require('child_process');
const compressing = require('./node_modules/compressing');
// 同步执行exec

child_process.execPromise = function (cmd, options, callback) {
    return new Promise(function (resolve, reject) {
        child_process.exec(cmd, options, function (err, stdout, stderr) {
            // console.log("执行完毕!");
            if (err) {
                console.log(err);
                callback && callback(stderr);
                reject(err);
                return;
            }
            resolve();
        })
    });
};

function zipCfg(m_path, callBack) {
    let zipDir = cc.path.mainFileName(m_path)
    Editor.log('*******************************开始压缩*******************************', zipDir);
    compressing.zip.compressDir(zipDir, m_path)
        .then(() => {
            Editor.log('*******************************压缩成功*******************************', m_path);
            callBack()
        })
        .catch(err => {
            Editor.error(err);
        });
}

/**
     * 清除原有课程模板目录
     * @param {string} url 
     */
function deleteFolderRecursive(url) {
    Editor.log('****************************清理导出文件夹*******************************' + url);
    let files = [];
    if (fs.existsSync(url)) {
        files = fs.readdirSync(url);
        files.forEach((file, index) => {
            var curPath = cc.path.join(url, file);
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(url);
    }
    Editor.log('****************************清理导出文件夹结束*******************************');
};

function runBuildMvAndCompress() {
    Editor.log('move file start.');
    let sourceUrl = Editor.Project.path + '\\build\\web-mobile\\assets';
    let destUrl = Editor.Project.path + '\\temp_zip';
    if (fs.existsSync(destUrl)) {
        deleteFolderRecursive(destUrl)
    }
    fs.mkdirSync(destUrl);
    destUrl = destUrl + '\\assets';
    Editor.log(`move file ${sourceUrl} to ${destUrl}`);
    fs.rename(sourceUrl, destUrl, function (err) {
        if (err) throw err;
        fs.stat(destUrl, function (err, stats) {
            if (err) throw err;
            Editor.log('stats: ' + JSON.stringify(stats));
        });
        Editor.log(`move file end.`);
    });
}

async function buildProject() {
    Editor.log('项目开始打包');
    let buildUrl = Editor.Project.path;
    let cocosUrl = 'D:\\Tools\\CocosDashboard\\resources\\.editors\\Creator\\2.4.3\\CocosCreator.exe';
    let cmd = cocosUrl + ` --path ${buildUrl} --build "platform=web-mobile;debug=true"`;
    Editor.log(cmd);
    await child_process.execPromise(cmd, null, (err) => {
        Editor.log("出现错误： \n" + err);
    });
    Editor.log('项目打包完毕');
}

function compressAsset(buildPath) {
    let selfPath = Editor.url('packages://template-export/core');
    let pyPath = PATH.join(selfPath, 'compress_res_tools.py ');
    // let buildPath = PATH.join(options.dest, 'assets');
    let cmd = 'py -3 ' + pyPath + buildPath;
    Editor.log('开始压缩资源', cmd);
    child_process.execPromise(cmd, { maxBuffer: 4 * 1024 * 1024 }, (error, stdout, stderr) => {
        if (stdout.length > 1) {
            Editor.log('you offer args:', stdout);
        } else {
            Editor.error('压缩失败 you don\'t offer args');
        }
        if (error) {
            Editor.error('压缩失败  stderr : ', stderr, error);
        } else {
            Editor.log('完成压缩资源')
            callback()
        }
    });
}

module.exports = {
    load() {
        Editor.log(Editor.frameworkPath);
        Editor.log(Editor.Project.path);
    },
    unload() {

    },
    messages: {
        'open-pannel'() {
            Editor.Panel.open('hello-world');
        },
        async 'say-hello'() {
            Editor.log('项目开始打包');
            let buildUrl = Editor.Project.path;
            let cocosUrl = 'D:\\Tools\\CocosDashboard\\resources\\.editors\\Creator\\2.4.3\\CocosCreator.exe';
            let cmd = cocosUrl + ` --path ${buildUrl} --build "platform=web-mobile;debug=true"`;
            Editor.log(cmd);
            await child_process.execPromise(cmd, null, (err) => {
                Editor.log("出现错误： \n" + err);
            });
            Editor.log('项目打包完毕');
            runBuildMvAndCompress();
            let destUrl = Editor.Project.path + '\\temp_zip\\assets';
            Editor.log('压缩zip开始。');
            destUrl = destUrl.replace(/\\/g, "/");
            Editor.log(destUrl);
            destUrl += '.zip';
            zipCfg(destUrl, () => {
                Editor.log('压缩zip完毕。');
            });
        }
    },
};