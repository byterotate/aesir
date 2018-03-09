# eslint-config-mfe-strict

## 简介

这是目前manhattan-fe的javascript部分的规则集，最初版本取自`airbnb`和`standard`的error配置的交集，之后根据具体开展会逐步调整

## change log

### 2017年9月5日

#### 以下规则由error调整为warn

* no-eval
* no-new
* no-fallthrough
* no-new-func
* no-return-assign
* no-unreachable
* no-debugger

#### 以下规则配置调整

##### curly

| prev | after|
| :--- | :----|
|"curly": ["error", "multi-line"]| "curly": "error"|

#### 以下规则因为需要讨论暂时移除

* no-cond-assign
* no-inner-declarations
* one-var

#### 增加了以下规则

##### no-console

| before | after|
| :--- | :----|
|null| | "no-console": "warn"|

### 2017年11月29日

#### 以下规则由error调整为warn

* no-unused-expressions

### 2017年12月05日

#### 以下规则由error调整为off，因为和prettier冲突

* no-mixed-operators

## release log

### 1.0.0
### 1.1.0
### 1.2.0