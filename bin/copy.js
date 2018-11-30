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
const fs = require('ztil/fs');
const path = require('ztil/path');
const stdout = require('ztil/stdout');


/**
 *****************************************
 * 复制文件夹
 *****************************************
 */
module.exports = async function copy(src, dist, options) {
    let arr = ['package.json', 'README.md', 'LICENSE'],
        transform = !options.copy;

    // 格式化目录
    src = path.cwd(src);
    dist = path.cwd(dist);

    // 打印信息
    stdout.block('Create package');

    // 遍历目录
    await Promise.all(
        await fs.mapdir(src, async stats => {
            if (!stats.isDirectory()) {
                await copyFile(stats.path, path.resolve(dist, path.relative(src, stats.path)), transform);
            }
        })
    );

    // 拷贝项目配置
    await Promise.all(
        arr.map(name => copyFile(path.cwd(name), path.resolve(dist, name)))
    );
};


/**
 *****************************************
 * 复制文件
 *****************************************
 */
async function copyFile(from, to, transform) {
    let idx = path.cwd().length + 1,
        result = await fs.readFile(from, 'utf8');

    // 编译内容
    if (transform && from.endsWith('.js')) {
        result = await babel.transform(result);
        result = result.code;
    }

    // 写入内容
    await fs.writeFile(to, result);

    // 打印信息
    stdout.info('copy:', from.slice(idx), '->', to.slice(idx));
}
