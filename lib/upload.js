/**
 * @file 上传文件的模块
 */

'use strict';

var
  /**
   * @desc promise
   */
  q = require('q'),

  /**
   * @desc 判断文件相关的工具包
   */
  util = require('lr-util-file'),

  /**
   * @desc 提示信息的工具包
   */
  debug = require('lr-util-debug'),

  /**
   * @desc path
   */
  path = require('path'),

  /**
   * @desc 发送静态文件的包
   */
  uploadDispatch = require('lr-upload-file'),

  /**
   * @desc 解析url的包
   */
  urlUtil = require('wurl');

/**
 * @desc 上传文件
 * @param puburl 上传远程地址
 * @param file gulp流中的file对象
 * @param str 上传文件的源路径
 * @returns {*|promise}
 */
module.exports = function(puburl, file, str, opts) {
  var deferred = q.defer();
  var fileUrl = util.isRelative(str.rel) ? path.resolve(path.dirname(file.path), str.rel) : str.rel;
  var result = null;
  if(util.isFile(fileUrl)) {
    uploadDispatch.upload(puburl, {
      files: fileUrl,
      file: file
    }, opts, function(err, data) {
      if(err) {
        debug.error('上传失败，原因是：' + err);
      }
      if(data) {
        for(var k in data) {
          var resultUrl = data[k];
          str.cdn = resultUrl;
          debug.log('提示', '发送文件 ' + file.path + ' 中的静态文件：'  + str.rel + ' 成功，替换为 ' + resultUrl);
        }
        result = str;
      }
      deferred.resolve(result);
    })
  } else {
    debug.warn('文件 ' + file.path + ' 中的静态文件：'  + str.rel + ' 不存在');
    deferred.resolve(result);
  }
  return deferred.promise;
}
