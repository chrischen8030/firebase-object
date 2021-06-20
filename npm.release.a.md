- [NPM 模块中的scope](#npm-模块中的scope)
  - [安装带有scope的模块](#安装带有scope的模块)
  - [使用带有scope的模块](#使用带有scope的模块)
  - [发布带有scope的模块](#发布带有scope的模块)
  - [将一个scope和一个仓库关联](#将一个scope和一个仓库关联)
- [一分钟教你发布npm包](#一分钟教你发布npm包)
  - [摘要：什么是npm?](#摘要什么是npm)
  - [如何发布一个自己的npm包](#如何发布一个自己的npm包)
  - [5、npm publish 发包](#5npm-publish-发包)
  - [6、查询发布的包](#6查询发布的包)
  - [7、安装使用方式](#7安装使用方式)
  - [8、如何撤销发布的包](#8如何撤销发布的包)
# NPM 模块中的scope
所有npm模块都有name，有的模块的name还有scope。scope的命名规则和name差不多，同样不能有url非法字符或者下划线点符号开头。scope在模块name中使用时，以@开头，后边跟一个/ 。package.json中，name的写法如下：

```
"name": "@somescope/somepackagename"

```
scope是一种把相关的模块组织到一起的一种方式，也会在某些地方影响npm对模块的处理。npm公共仓库支持带有scope的的模块，同时npm客户端对没有scope的模块也是向后兼容的，所以可以同时使用两者。

## 安装带有scope的模块

带有scope的模块安装在一个子目录中，如果正常的模块安装在node_modules/packagename目录下，那么带有scope的模块安装在node_modules/@myorg/packagename目录下，@myorg就是scope前面加上了@符号，一个scope中可以包含很多个模块。
```
# 安装一个带有scope的模块
npm install @myorg/mypackage

```
在`package.json`中写明一个依赖:
```
"dependencies": {
"@myorg/mypackage": "^1.3.0"
}
```

如果@符号被省略，那么npm会尝试从github中安装模块，在npm install命令的文档中有说明
https://docs.npmjs.com/cli/install

## 使用带有scope的模块

在代码中require一个含有scope的模块：

```
require(‘@myorg/mypackage’)

```
nodejs在解析socpe模块的时候，并没有把它当做一个有什么蹊跷的东西来处理，仅仅是按照路径去找@myorg目录下的mypackage模块。

## 发布带有scope的模块

带有scope的模块可以被发布到任意支持socpe模块的npm仓库，包括npm公共仓库，公共仓库从2015-04-19就开始支持带有scope的模块了。

如果有必要，可以把某个scope关联到某个仓库，见下面的说明。

如果要发布一个公共socpe模块，你必须在最开始发布的时候指定–access public。这样会让模块能被公开使用，就像在publish之后运行了 npm access public命令一样。

如果要发布私有模块，那么你必须有一个npm私有模块账户，可以选择自己搭建一个npm服务，或者直接使用官方的。发布私有模块的命令：

```
npm publish

# 或者
npm publish –access restricted 

```
即发布socpe模块时，默认就是restricted的。这些在npm publish文档里边可以看到详细说明。 https://docs.npmjs.com/cli/publish

## 将一个scope和一个仓库关联

scope可以和一些自己搞的npm仓库关联起来。这样你就可以同时使用npm公共仓库和一些其他的私有仓库中的模块，例如企业npm。可以用npm login把scope关联到一个仓库：

```
npm login –registry=http://reg.example.com –scope=@myco

```
scope和仓库可以是一个多对一的关系：一个仓库里边可以放多个scope，但是一个scope同时只能放在一个仓库中。也可以用npm config把scope关联到一个仓库：

```
npm config set @myco:registry http://reg.example.com

```
当一个scope关联到一个私有仓库之后，该scope下的模块在npm install的时候都会从它关联的仓库中获取模块，而不是npm配置的仓库，发布的时候也是同样的道理，会发布到它关联的仓库而不是npm配置的仓库。

作者：wavesnow
链接：https://www.jianshu.com/p/ac5b5f65320b
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。



# 一分钟教你发布npm包

## 摘要：什么是npm?
npm是javascript著名的包管理工具，是前端模块化下的一个标志性产物
简单地地说，就是通过npm下载模块，复用已有的代码，提高工作效率
和移动端开发中，iOS使用的Cocoapods，Android使用的maven有异曲同工之妙。

## 如何发布一个自己的npm包
1、创建一个npm的账号
发布包之前你必须要注册一个npm的账号

2、初始化一个简单的项目发布
a、本地创建一个文件夹：例如：z-tool
b、执行命令进入目录: $ cd z-tool
c、执行npm init 初始化项目。默认一路回车就行

```
sh-neverleave:z-tool neverleave$ npm init

This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (z-tool) 
version: (1.0.0) 
description: 
entry point: (index.js) 
test command: 
git repository: 
keywords: 
author: 
license: (ISC) 
About to write to /Users/neverleave/Desktop/z-tool/package.json:

{
  "name": "z-tool",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}

Is this ok? (yes) 

```

```
默认字段简介：
name：发布的包名，默认是上级文件夹名。不得与现在npm中的包名重复。包名不能有大写字母/空格/下滑线!
version：你这个包的版本，默认是1.0.0。对于npm包的版本号有着一系列的规则，模块的版本号采用X.Y.Z的格式，具体体现为：
  1、修复bug，小改动，增加z。
  2、增加新特性，可向后兼容，增加y
  3、有很大的改动，无法向下兼容,增加x
description：项目简介
mian：入口文件，默认是Index.js，可以修改成自己的文件 
scripts：包含各种脚本执行命令
test：测试命令。
author：写自己的账号名
license：这个直接回车，开源文件协议吧，也可以是MIT，看需要吧。
```
d、在z-tool文件夹中创建一个文件名为index.js的文件，简单的写了一下内容。
```
!function(){
  console.log(`这是引入的包入口`)
}()

```
3、如果本机第一次发布包（非第一次可忽略）
在终端输入npm adduser，提示输入账号，密码和邮箱，然后将提示创建成功，具体如下图。
【注意】npm adduser成功的时候默认你已经登陆了，所以可跳过第四步。
```
npm adduser 

```
最后一行显示登录信息，as 后面是用户名。on 后是源地址，如果不是https://registry.npmjs.org/，比如是淘宝源，请切换。可以参考：https://segmentfault.com/a/11...



4、非第一次发布包
在终端输入npm login，然后输入你创建的账号和密码，和邮箱，登陆，结果同步骤三。

## 5、npm publish 发包
成功发布：

sh-neverleave:z-tool neverleave$ npm publish
+ z-tool@1.0.1
注意：如果项目里有部分私密的代码不想发布到npm上，可以将它写入.gitignore 或.npmignore中，上传就会被忽略了

## 6、查询发布的包
到npm官网全局搜索即可

## 7、安装使用方式
和其他包使用方式一致，具体使用可以看源码介绍或者README.md。

## 8、如何撤销发布的包
终端执行 npm unpublish
例如：
1、npm unpublish z-tool@1.0.0 删除某个版本
2、npm unpublish z-tool --force 删除整个npm市场的包

不过撤包推荐用法：
npm unpublish的推荐替代命令：npm deprecate <pkg>[@<version>] <message>
使用这个命令，并不会在社区里撤销你已有的包，但会在任何人尝试安装这个包的时候得到警告
例如：npm deprecate z-tool '这个包我已经不再维护了哟～'

【注意】如果报权限方面的错，加上--force

发布错误集锦
1、需要提高版本号

#1、发包 npm publish 失败
sh-neverleave:z-tool neverleave$ npm publish
npm ERR! publish Failed PUT 400
npm ERR! code E400
npm ERR! deprecations must be strings : z-tool

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/neverleave/.npm/_logs/2018-11-23T10_52_01_742Z-debug.log
sh-neverleave:z-tool neverleave$ npm publish


#2、发包 npm publish 失败
sh-neverleave:z-tool neverleave$ npm publish
npm ERR! publish Failed PUT 403
npm ERR! code E403
npm ERR! You cannot publish over the previously published versions: 1.0.3. : z-tool

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/neverleave/.npm/_logs/2018-11-23T11_24_57_662Z-debug.log
sh-neverleave:z-tool neverleave$ 
2、发包 npm publish 失败
解决方案：终端执行： npm publish --access public

参考：https://stackoverflow.com/que...

#1、发包 npm publish 失败
sh-neverleave:npm neverleave$ npm publish
npm ERR! publish Failed PUT 400
npm ERR! code E400
npm ERR! unscoped packages cannot be private : z-tool

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/neverleave/.npm/_logs/2018-11-23T08_44_21_310Z-debug.log
sh-neverleave:npm neverleave$ 

#解决方案：终端执行： npm publish --access public
sh-neverleave:npm neverleave$ npm publish --access public
+ z-tool@1.0.0
sh-neverleave:npm neverleave$ 
3、确保登录的用户账号正确

sh-neverleave:npm neverleave$ npm publish
npm ERR! publish Failed PUT 404
npm ERR! code E404
npm ERR! 404 User not found : z-tool
npm ERR! 404 
npm ERR! 404  'z-tool' is not in the npm registry.
npm ERR! 404 You should bug the author to publish it (or use the name yourself!)
npm ERR! 404 
npm ERR! 404 Note that you can also install from a
npm ERR! 404 tarball, folder, http url, or git url.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/neverleave/.npm/_logs/2018-11-23T07_32_28_518Z-debug.log
4、登录时需要在username 前加‘~’，具体大家可以验证

sh-neverleave:npm neverleave$ npm login
Username: (~neverleave) neverleave
Password: (<default hidden>) 
Email: (this IS public) (1063588359@qq.com) 
npm ERR! code EAUTHIP
npm ERR! Unable to authenticate, need: Basic

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/neverleave/.npm/_logs/2018-11-23T07_27_50_877Z-debug.log
sh-neverleave:npm neverleave$ 
5、无权限删除线上的包（撤包有时间限制，24小时）
解决方案：加上 --force

sh-neverleave:z-tool neverleave$ npm unpublish z-tool
npm ERR! Refusing to delete entire project.
npm ERR! Run with --force to do this.
npm ERR! npm unpublish [<@scope>/]<pkg>[@<version>]
sh-neverleave:z-tool neverleave$ 

#解决方案（内部有被鄙视的话，? I sure hope you know what you are doing.）
sh-neverleave:z-tool neverleave$ npm unpublish z-tool --force
npm WARN using --force I sure hope you know what you are doing.
- z-tool
sh-neverleave:z-tool neverleave$ 
6、删除npm市场的包同名的24小时后才能重新发布

sh-neverleave:z-tool neverleave$ npm publish
npm ERR! publish Failed PUT 403
npm ERR! code E403
npm ERR! z-tool cannot be republished until 24 hours have passed. : z-tool

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/neverleave/.npm/_logs/2018-11-23T11_41_24_086Z-debug.log
sh-neverleave:z-tool neverleave$ 
完结