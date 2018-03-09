# mfe-tools-themis

## 简介

一个一揽子的代码静态分析和自动格式化的工具

`themis`是古希腊神话中的戒律之神，工具的命名遵循mfe传统，从古希腊神话中找灵感

## 使用说明

### 安装

```bash
npm install -g @didi/mfe-tools-themis
```

or

```bash
npm install @didi/mfe-tools-themis
```

然后通过npm script 调用

## 功能

工具分成两部分，`静态分析`和`自动格式化`

### 静态代码分析

```bash
 >themis lint

  Usage: lint [options] [patterns...]

  lint规则校验


  Options:

    -m, --check-mode <mode>  检测文件[only-changed(增量)|in-stage（暂存）]
    -p, --prettier-check     格式化检测
    -s, --strict-check       严格规则集检测
    -e, --extend-check       建议规则集检测
    -h, --help               output usage 
```

### 代码格式化

```bash
 >themis format
 Usage: format [options] [patterns...]

  格式化操作


  Options:

    -m, --check-mode <mode>  检测文件[only-changed(增量)|in-stage（暂存）]
    -l, --list-difference    列出需要格式化的文件
    -d, --debug-check        列出推荐人工格式化的文件
    -S, --safe-format        只格式化美化后前后一致的ast tree
    -f, --force-write        强制格式化，不推荐
    -h, --help               output usage
```

### 项目初始化

在项目根目录下运行

```bash
 >themis init
```

## release log

### 0.0.2

* 基本功能实现

### 0.0.3

* [feature]增加了lint工具对.vue文件的支持
* [feature]增加了format工具对非js文件的忽略处理
* [feature]增加了in-stage模式，用于选取那些已经处于暂存区的文件进行校验
* [fix bug]对only-change模式下untracked files的获取

### 0.0.4

* [feature]增加了init命令，一键接入现有项目

### 0.0.5

* [fix]追加了了init cli少引入的部分依赖

### 0.0.6

* [fix]version根据package.json的version字段

### 0.0.7

* [fix]修复了自测中的问题

### 0.0.8

* [fix]原有的获取eslint命令行路径方式在node 8 中存在问题，改用直接获取.bin

### 0.0.9

* [fix] 修复对node 8 版本中package-lock.json存在老版本eslint导致eslint无法升级的问题
* [fix] 删除了部分冗余的日志
* [feature] 格式化规则中最大行长由80调整为120

### 0.1.0

* [modify] 严格规则集版本由0.0.1调整为1.0.0
* [modify] 展示log和ui动效调整
* [feature] 原有通过子shell和eslint和prettier交互方式调整为通过API调用
* [feature] 可以通过根据项目根目录下的eslintrc合并基本配置，如globals，parseOptions,但extends和rules属性会被屏蔽

### 0.1.1

* [feature] 向下兼容到node4 LTS

### 0.2.0

* [feature] 增加了对.vue文件的过渡性支持
* [feature] 默认的eslint规则取消了对缩进的校验

### 0.2.1

* [fix] 修复了对json文件的lint支持

### 0.2.2

* [update] 更新到eslint-config-strict@1.1.0

### 0.3.0

* [fix] 默认eslint config增加了对`...`运算符的支持
* [feature] 增加了--quiet命令，可以只展示error类错误

### 0.3.1

* [update] 更新到eslint-config-strict@1.2.0