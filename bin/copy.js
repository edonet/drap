/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-30 09:34:30
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const babel = require('@airk/babel');
const fs = require('airk/fs');
const path = require('airk/path');
const stdout = require('airk/stdout');


/**
 *****************************************
 * 复制文件夹
 *****************************************
 */
module.exports = async function copy(src, dist, options) {
    let arr = ['package.json', 'README.md', 'LICENSE'];

    // 格式化目录
    src = path.cwd(src);
    dist = path.cwd(dist);

    // 打印信息
    stdout.block('Create package');

    // 移除文件
    await fs.rmdir(dist);

    // 遍历目录
    await Promise.all(
        await fs.mapdir(src, async stats => {
            if (stats.isDirectory()) {
                await fs.mkdir(path.resolve(dist, path.relative(src, stats.path)));
            } else {
                await copyFile(stats.path, path.resolve(dist, path.relative(src, stats.path)), options);
            }
        })
    );

    // 拷贝项目配置
    await Promise.all(
        arr.map(name => copyFile(path.cwd(name), path.resolve(dist, name), { copy: true }))
    );
};


/**
 *****************************************
 * 复制文件
 *****************************************
 */
async function copyFile(from, to, { target, ...options }) {
    let idx = path.cwd().length + 1,
        result = await fs.readFile(from, 'utf8');

    // 编译内容
    if (!options.copy && !path.basename(from).startsWith('__')) {
        result = await babel.transform(result, { filename: from, comments: false, target });
        result = result.code;
    }

    // 写入内容
    await fs.writeFile(to, result);

    // 打印信息
    stdout.info('copy:', from.slice(idx), '->', to.slice(idx));
}
