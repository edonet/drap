#!/usr/bin/env node


/**
 *****************************************
 * Created by lifx
 * Created on 2018-07-09 17:31:39
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    fs = require('@arted/utils/fs'),
    path = require('@arted/utils/path'),
    { info, block, error } = require('@arted/utils/stdout'),
    args = require('yargs'),
    copy = require('./copy');


/**
 *****************************************
 * 定义命令
 *****************************************
 */
async function run() {
    let argv = args.argv,
        src = argv.src || argv._[0] || 'src',
        dist = argv.dist || argv._[1] || 'dist',
        stats = await fs.stat(src);


    // 判断是否存在目录
    if (stats && stats.isDirectory()) {
        let cwd = path.cwd(),
            arr = ['package.json', 'LICENSE', 'README.md'];

        // 打印信息
        block('Create package');

        // 拷贝项目文件
        await copy(src, dist);

        // 拷贝项目配置
        await Promise.all(arr.map(async name => {
            let from = path.cwd(name),
                to = path.cwd(dist, name);

            // 复制文件
            if (await fs.stat(from)) {
                await fs.writeFile(to, await fs.readFile(from));
                info('copy:', path.relative(cwd, from), '-->', path.relative(cwd, to));
            }
        }));

        // 结束命令
        info('');
    }
}


/**
 *****************************************
 * 执行命令
 *****************************************
 */
run().catch(error);
