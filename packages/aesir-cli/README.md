# aesir-cli

## 简介

一个一揽子的代码静态分析和自动格式化的工具

`aesir`是北欧神族的英文，一群熵减的生物，和我们要做的事不谋而合

## 使用说明

### 安装

```bash
npm install -g aesir-cli
```

or

```bash
npm install aesir-cli
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
 >aesir init
```

## release log

### 0.0.1

* 基本功能实现
* [feature]增加了lint工具对.vue文件的支持
* [feature]增加了format工具对非js文件的忽略处理
* [feature]增加了in-stage模式，用于选取那些已经处于暂存区的文件进行校验
* [feature]增加了init命令，一键接入现有项目
* [feature] 原有通过子shell和eslint和prettier交互方式调整为通过API调用
* [feature] 可以通过根据项目根目录下的eslintrc合并基本配置，如globals，parseOptions,但extends和rules属性会被屏蔽
* [feature] 增加了对.vue文件的过渡性支持
* [feature] 默认的eslint规则取消了对缩进的校验
* [feature] 向下兼容到node4 LTS
* [feature] 增加了--quiet命令，可以只展示error类错误

### 0.0.2

* [fix] README modify
