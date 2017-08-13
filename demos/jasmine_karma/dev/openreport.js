//打开测试报告，下面exex中的文件路径需要和配置文件中一致
var c = require('child_process');
var path = require('path');

if (process.platform == 'wind32') {
  cmd = 'start "%ProgramFiles%\Internet Explorer\iexplore.exe"';
} else if (process.platform == 'linux') {
  cmd = 'xdg-open';
} else if (process.platform == 'darwin') {
  cmd = 'open';
}

c.exec(`${cmd} "${path.resolve('file://', __dirname, '../test/screenshots/htmlReport.html')}"`);
