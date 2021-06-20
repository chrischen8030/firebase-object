
- [从零开发一个健壮的npm包](#从零开发一个健壮的npm包)
  - [一、配置eslint](#一配置eslint)
  - [二、编写代码](#二编写代码)
  - [三、使用babel](#三使用babel)
  - [四、编写测试](#四编写测试)
  - [五、Travis-CI+Coveralls](#五travis-cicoveralls)
- [Lines        : 92.65% ( 63/68 )](#lines---------9265--6368-)
  - [六、发布](#六发布)
# 从零开发一个健壮的npm包

[原文](https://juejin.cn/post/6844903605229584398)

最近写 node 的时候遇到一个需求，需要清理某目录下超过3天图片，本来想在 npm 找个包直接用用，结果没找到合适的，于是就自己撸一个了。

本文主要讲述如何从零开始开发一个完善健壮的 npm 包，主要涉及到一些工具的使用配置，包的功能不是重点。

## 一、配置eslint

ESLint是一个代码风格检测工具，比如使用空格还是tab，要不要加分号，使用驼峰命名还是下划线等等。可以保证一个团队的代码风格保持一致。
```javascript
npm install eslint -g
eslint init
或者
./node_modules/.bin/eslint --init

```
复制代码根据 eslint 提供的选项结合自己的需求，一路选择好后，会在根目录创建一个 .eslintrc.json 文件，里面一系列的规则配置，这个时候你再写代码，如果不符合规范，编辑器就会报错提示，如果某些目录不想使用校验，可以创建一个 .eslintignore，把不需要校验的目录放进入。为了方便执行校验，我们在 package.json 里配置一下 scripts:
```
"scripts": {
  "lint": "eslint --fix src"
}
```
复制代码可以配合githook强制每次提交的时候校验代码：使用git钩子做eslint校验

## 二、编写代码
我们在src目录下编写我们的代码，拆分成具体步骤为

1. 读取目录下所有文件
2. 筛选出我们需要处理的文件，比如创建或者修改时间超过3天的图片或者日志
3. 删除这些文件

我们分成3个函数：

// readAllFileInfo.js

```
// 使用fs.readdir读取目录下所有文件
fs.readdir(filePath, function(err, files) {
    if (err) {
      reject(err);
    } else {
      Promise.all(files.map(file => {
        return filterFile(file, options);
      }))
        .then(deleteFiles => {
          resolve(deleteFiles.filter(deleteFile => deleteFile));
        });
    }
  });

```
// filterFile.js
```
// 使用fs.stat读取文件信息，然后筛选出需要删除的文件
fs.stat(fileName, (err, stats) => {
  if (err) {
    reject(err);
  } else {
    const time = stats[expiredType];
    const distanceTime = formatDate(date);
    const extName = path.extname(fileName);
    if (now - time > distanceTime && extName === `.${ext}`) {
      deleteFile(fileName)
        .then((res) => {
          resolve(res);
        });
    } else {
      resolve();
    }
  }
});

```
// deleteFile.js
```
// 使用fs.unlink删除文件
fs.unlink(fileName, err => {
  if (err) {
    reject(err);
  } else {
    resolve(fileName);
  }
});

```

复制代码这里主要讲一下解决问题的思路，首先整理一下解决这个问题需要哪些步骤，然后每一个步骤可以抽象成一个函数，想一下函数的传参和返回值，最后可以设计一下更加兼容易扩展的 API，具体代码可以查看仓库：https://github.com/wulv/del-expired-file。

## 三、使用babel
在低版本的 node 可能还不支持某些 es6 语法，比如对象解构等，所以需要使用 babel 编译成低版本也能识别的语法。我们把 src 目录里的代码编译到 lib 目录，然后我们在 package.json 里，把 "main" 改为 "lib/index.js"，这样对外暴露出去的代码就不会出现兼容性问题。
下载 babel-cli 依赖：
```
npm install --save-dev babel-cli
// 下载预设，预设就是别人配置好的一系列规则，编译在规则内的语法
npm install --save-dev babel-preset-es2015

```

复制代码配置好 .babelrc:
```
{
	"presets": ["es2015"]
}

```
复制代码在 package.json 里配置一下 scripts:
```
"scripts": {
  "build": "babel src -d lib",
  "build:watch": "npm run build -- --watch"
}

```
复制代码这样运行 npm run build 就会编译源文件到 lib 目录了。

## 四、编写测试
为了保障程序的稳定性，我们一定要写测试用例，特别是当你的程序依赖越来越多的时候，比如你改了A模块，你觉得你的改动都没问题，但一发布出去就会出现意想不到的 bug 因为影响到了你不知道的某个模块。这个时候测试就尤为重要，可以帮你避免很多低级错误。我们使用 mocha 和 chai 做测试框架和断言，下载依赖。
```
npm install mocha chai --save-dev

```
复制代码我们在项目根目录建立一个 test 目录。创建 index.formatDate.js，内容为：
```
'use strict';
const chai = require('chai');
const formatDate = require('../lib/formatDate');

const expect = chai.expect;
const S = 1000;

describe('format dete', () => {
  it('test 2s', function() {
    expect(formatDate('2s')).to.be.equal(2 * S);
  });
});

```
这里只是演示一下基本的语法，代码太多，具体看仓库。然后在 package.json 里再添加一个 scripts:
```
"test": "npm run build && mocha -t 5000"

```
## 五、Travis-CI+Coveralls
Travis-CI 是一个持续集成构建项目，结合github 可以实现很强大的功能，比如你给一个仓库提交 PR 后，可以自动帮你跑完测试用例，如果测试没有通过，就不能 merge 到 master，Coveralls 是一个自动化测试覆盖率的服务，用于收集测试覆盖率报告，对于开源项目免费，配置好这个后，就可以生成一个显示你代码测试覆盖率的 badge。Coveralls 可以使用 GitHub 账号登录，登录之后可以在 https://coveralls.io/repos/new 添加需要收集报告的 repo。
首先安装一下 istanbul 这个工具来检测代码的测试覆盖率：
npm install istanbul --save-dev
复制代码然后在 package.json 中的 scripts 里添加：
"cover": "istanbul cover node_modules/mocha/bin/_mocha"
复制代码运行 npm run cover 就可以看到你的代码测试覆盖率了
========= Coverage summary =========
Statements   : 92.65% ( 63/68 )
Branches     : 75% ( 15/20 )
Functions    : 100% ( 14/14 )
Lines        : 92.65% ( 63/68 )
====================================
复制代码将测试覆盖率报告提交给 Coveralls，首先安装 coveralls:
npm install coveralls --save-dev
复制代码然后在 package.json 中的 scripts 里添加
 "coveralls": "npm run cover -- --report lcovonly && cat ./coverage/lcov.info | coveralls"
复制代码然后创建 .travis.yml 文件，
sudo: false
language: node_js
os:
  - linux
  - osx
node_js:
  - 6
  - 8
  - 9
  - 10
branches:
  only:
  - master
install:
- npm install
script:
  - npm run lint
  - npm run build
  - npm run cover
after_success:
- npm run coveralls
复制代码将代码推到 github 后，打开 https://travis-ci.org/ ，点开右上角头像 -> profile，把自己仓库的开关打开：

在 README.md 里添加代码测试覆盖率的 badge，我们可以使用 http://shields.io 来添加 badge，比如还有下载量，star数等这些badge。
[![Build Status](https://travis-ci.org/wulv/del-expired-file.png)](https://travis-ci.org/wulv/del-expired-file)
[![Coverage Status](https://img.shields.io/coveralls/wulv/del-expired-file/master.svg?style=flat)](https://coveralls.io/github/wulv/del-expired-file?branch=master)
复制代码最终可以看到以下效果，当你看到一个 npm 如果显示了测试覆盖率，是不是顿时放心很多了呢？

## 六、发布
至此我们基本已经写好了一个相对比较健壮的仓库了，现在发布到 npm 上，如果没有 npm 账号的话，需要先注册一下，然后运行
npm adduser
复制代码输入用户名和密码，npm publish，这样你的仓库就发布好了，如果要更新版本，要遵循 Semver(语义化版本号) 规范：

升级补丁版本号：npm version patch
升级小版本号：npm version minor
升级大版本号：npm version major

总结
总结一下上面使用到的工具和技术：

我们可以看到，如果只是实现功能，把目标定在仅仅实现需求上，写这个 npm 包，用一个文件三个函数就完成了，但是这样的话，这个包估计也就只有你自己用了，以后的维护，修改都会比较麻烦，而使用这一套工具后，就健壮很多了。工作上也是这样，我们需要追求卓越，不断打磨自己的手艺，做出更完美的作品。
打个广告，杭州有赞诚招前端开发工程师，我们在4月举办了一次前端技术开放日，详情查看链接：https://tech.youzan.com/fe-open-day-2018/。公司福利多多：


标配：MacBook，报销：显示屏、鼠标、机械键盘
五险一金、980元/月的餐补、加班打车费报销、年度outing和体检、每人每年有机会参加外部大会/培训等
各种高大上的聚餐、千奇百怪的团建，长期投食的零食架...
高配电视、游戏机、桌球、乒乓球、台球、健身器械，还有四驱赛道等，等你来战~


有意向的话请发送简历到wulv#youzan.com。
参考链接

[mocha教程](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html)
[travis-ci](https://travis-ci.org/)
[how-to-add-badge-in-github-readme](https://github.com/yangwenmai/how-to-add-badge-in-github-readme)