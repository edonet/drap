#!/usr/bin/env node


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
const fs = require('airk/fs');
const pkg = require('../package.json');
const copy = require('./copy');


/**
 *****************************************
 * 定义参数
 *****************************************
 */
yargs
    .boolean('copy')
    .alias('c', 'copy')
    .alias('t', 'target');


/**
 *****************************************
 * 定义脚本
 *****************************************
 */
module.exports = async function drap() {
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
};

