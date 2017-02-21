/**
 * Created by slipkinem on 2016/8/30.
 */
var fs = require('fs');

fs.createReadStream('xmind_3.6.50.201606271038_wm.exe').pipe(fs.createWriteStream('lvsen.exe'));