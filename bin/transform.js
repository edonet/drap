/**
 *****************************************
 * Created by lifx
 * Created on 2018-07-10 15:22:06
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    babel = require('babel-core'),
    resolve = require.resolve,
    options = {
        ast: false,
        sourceMaps: false,
        comments: false,
        presets: [
            resolve('babel-preset-env'),
            resolve('babel-preset-stage-3')
        ],
        plugins: [
            resolve('babel-plugin-transform-runtime')
        ]
    };


/**
 *****************************************
 * 转换代码
 *****************************************
 */
module.exports = function transform(code) {
    return babel.transform(code, options).code;
};
