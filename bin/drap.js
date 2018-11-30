/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-30 09:21:26
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const yargs = require('yargs');
const fs = require('ztil/fs');
const pkg = require('../package.json');
const copy = require('./copy');


/**
 *****************************************
 * 定义参数
 *****************************************
 */
yargs
    .boolean('transform')
    .alias('t', 'transform');


/**
 *****************************************
 * 定义脚本
 *****************************************
 */
async function run() {
    let argv = yargs.argv,
        src = argv.src || argv._[0] || pkg.library || 'lib',
        dist = argv.dist || argv._[1] || 'dist';

    // 判断是否存在源文件
    if (await fs.stat(src)) {

        // 创建文件目录
        await fs.rmdir(dist);
        await fs.mkdir(dist);

        // 复制文件
        await copy(src, dist, argv);
    }
}


/**
 *****************************************
 * 启动脚本
 *****************************************
 */
module.exports = run().catch(console.error);
