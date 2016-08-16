/**
 * @file 查找html中的静态文件并返回
 */

'use strict';

var
  /**
   * @desc lodash工具包
   */
  _ = require('lodash'),

  /**
   * @desc 匹配html中的script标签
   */
  jsReg = /[ \f\t\v]*<script\s+[^>]*?src="(?!https?:)([^"]+\.js)"[^>]*?>[\s\S]*?<\/script>[ \f\t\v]*/ig,

  /**
   * @desc 匹配html中的link标签
   */
  cssReg = /[ \f\t\v]*<link\s+[^>]*?href="(?!https?:)([^"]+\.css)"[^>]*?>[ \f\t\v]*/ig;

/**
 * @desc 查出字符串中的js和css标签
 * @param str
 * @returns {{js: Array, css: Array}}
 */
module.exports = function(str, opts) {
  var jsFiles = [],
    cssFile = [];
  str.replace(cssReg, function(all, value) {
      cssFile.push({
        str: _.trim(all),
        rel: _.trim(opts.relativePath + value),
		ori:_.trim(value)
      });
    })
    .replace(jsReg, function(all, value) {
      jsFiles.push({
        str: _.trim(all),
        rel: _.trim(opts.relativePath + value),
		ori:_.trim(value)
      });
    })
  return {
    js: jsFiles,
    css: cssFile
  };
}
