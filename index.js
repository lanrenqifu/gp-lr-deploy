/**
 * @file 发送html中js与css并替换的gulp插件
 */

"use strict";

var through = require('through2');
var gutil = require('gulp-util');
var scanhtml = require('./lib/scan');
var upload = require('./lib/upload');
var path = require('path');
var q = require('q');
var _ = require('lodash');

var PLUGIN_NAME = 'gp-lr-deploy';
//将代码中 <!--debug start--> code here <!--debug end--> 标识的测试代码删掉
var debugReg = /[ \f\t\v]*<!--\s*debug\s+start\s*-->[\s\S]*?<!--\s*debug\s+end\s*-->[ \f\t\v]*/ig;

/**
 * @desc 发送html中js与css并替换
 * @param puburl 上传远程地址
 * @param opts
 * @returns {*}
 */

module.exports = function index(puburl, opts) {
	//newby1  2016-03-19
	//opts.relativePath 配置相对路径;
    opts = opts || {};
    opts.host = opts.host || null;
	opts.relativePath = opts.relativePath || '';
	opts.exts = opts.exts || ['.html'];

  return through.obj(function (file, encoding, cb) {

    if (file.isNull()) {
      return cb(null, file)
    }
    if(file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    var ext = path.extname(file.path);
    //只支持html后缀的文件
    //newby1 修改。支持配置内的文件
    if(opts.exts.indexOf(ext) == -1) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Not support file: ' + file.path + ' !'))
    }
    var newHtml = file.contents.toString();
    newHtml = newHtml.replace(debugReg, '');

    q.fcall(function() {
      //扫出需替换的js与css路径
      return scanhtml(file.contents.toString(), opts)
    })
    .then(function(output) {
        //遍历路径发送上线
        return q.all(_.flattenDeep([output['js'].map(function(js) {
          return upload(puburl, file, js, opts);
        }), output['css'].map(function(css) {
          return upload(puburl, file, css, opts);
        })]));
      })
    .then(function(result) {
        //替换
        result.forEach(function(item) {
          if(item != null) {
            //先替换script标签中的路径字符串，再将整个script标签字符串统一替换，防止替错
            newHtml = newHtml.replace(item.str, (item.str.replace(item.ori, item.cdn)));
          }
        });

        try {
          file.contents = new Buffer(newHtml);
          cb(null, file);
        } catch (err) {
          cb(new gutil.PluginError(PLUGIN_NAME, err));
        }
      }.bind(this))
    .catch(function(msg) {
        debug.error(msg);
        cb(new gutil.PluginError(PLUGIN_NAME, msg));
      });
  })
}
