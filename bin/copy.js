/**
 *****************************************
 * Created by lifx
 * Created on 2018-07-10 15:37:39
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
    { info } = require('@arted/utils/stdout'),
    transform = require('./transform'),
    relative = (
        cwd => dir => path.relative(cwd, dir)
    )(path.cwd());


/**
 *****************************************
 * 复制文件
 *****************************************
 */
module.exports = async function copy(src, dist) {
    let arr = await fs.readdir(src);

    // 创建目录文件夹
    await fs.stat(dist) || await fs.mkdir(dist);

    // 拷贝文件
    await Promise.all(arr.map(async name => {
        let from = path.cwd(src, name),
            to = path.cwd(dist, name),
            code;

        // 处理目录
        if ((await fs.stat(from)).isDirectory()) {
            return name !== 'node_modules' && copy(from, to);
        }

        // 获取原码
        code = await fs.readFile(from);

        // 处理文件
        if (name.endsWith('.js') && /^(import|export) /m.test(code)) {
            await fs.writeFile(to, transform(code));
        } else {
            await fs.writeFile(to, code);
        }

        // 打印信息
        info('copy:', relative(from), '-->', relative(to));
    }));

};
