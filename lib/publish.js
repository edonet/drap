/**
 *****************************************
 * Created by lifx
 * Created on 2018-07-09 17:40:28
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
    argv = require('yargs').argv;


/**
 *****************************************
 * 预处理发布命令
 *****************************************
 */
module.exports = async () => {
    let {
            name, version, lib, scripts = {}
        } = await fs.resolve('./package.json');

    // 处理发布仓库
    if (lib) {
        let publishDir = path.cwd(lib),
            arr = ['package.json', 'LICENSE', 'README.md'];

        // 创建目录
        await fs.stat(publishDir) || await fs.mkdir(publishDir);

        // 复制配置文件
        await Promise.all(arr.map(async name => {
            let src = path.cwd(name),
                dist = path.cwd(publishDir, name);

            // 复制文件
            await fs.stat(src) && await fs.copy(src, dist);
        }));

        // 更新命令
        process.argv.splice(3, 0, lib);
        argv.version || process.argv.splice(4, 0, '--new-version', version);
    }

    // 执行自定义发布命令
    if (scripts.publish) {
        process.argv.splice(2, 0, 'run');
    }

    // 添加访问类型
    if (!argv.access && name.startsWith('@')) {
        process.argv.push('--access', 'public');
    }
};
