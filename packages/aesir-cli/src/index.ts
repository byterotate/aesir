#! /usr/bin/env node
import * as commander from 'commander'
import * as R from 'ramda'
import { parseGlobPatterns, getFilesByMode, validExtFilesFilter } from './lib/helper'
import { CAN_SUPPORT_EXT } from './lib/constant'
import * as lint from './lint'
import { initMain } from './cli'
import * as log from './lib/log'
import { prettierConfigByExt } from './lib/config'
import { Format } from './format'
import { FormatVue } from './vue.format'

const version = require('../package.json').version
commander
  .version(version)

commander
  .command('lint [patterns...]')
  .description('lint规则校验')
  .option('-m, --check-mode <mode>', 'only-change(增量)|in-staged（只存在于暂存区的文件）]')
  .option('-p, --prettier-check', '格式化检测')
  .option('-s, --strict-check', '严格规则集检测')
  .option('-e, --extend-check', '建议规则集检测')
  .option('-q, --quiet', '是否只显示error规则')
  .action(function (patterns, option) {
    let files
    if (option.checkMode === 'only-change' || option.checkMode === 'in-staged') {
      files = getFilesByMode(option.checkMode)
    } else {
      files = parseGlobPatterns(patterns)
    }
    let commandNumber = 0
    if (option.prettierCheck === true) {
      commandNumber += 1
    } 
    if (option.strictCheck === true) {
      commandNumber += 2
    }
    if (option.extendCheck === true) {
      commandNumber += 4
    }
    const [configPath] = lint.genarateConfig(commandNumber)

    const filesGroupedByExt = validExtFilesFilter(files)

    let errorCode = 0
    console.info(option.quiet)
    for (let ext of CAN_SUPPORT_EXT) {
      if (filesGroupedByExt[ext] && filesGroupedByExt[ext].length > 0) {
        errorCode = lint.eslintCheck(configPath, filesGroupedByExt[ext], option.quiet || false)
      }
    }
    process.exit(errorCode)
  })

commander
  .command('format [patterns...]')
  .description('格式化操作,此格式化只作用于.js文件，.vue文件需要手动修复')
  .option('-m, --check-mode <mode>', 'only-change(增量)|in-staged（只存在于暂存区的文件）]')
  .option('-l, --list-difference', '列出需要格式化的文件')
  .option('-d, --debug-check', '列出推荐人工格式化的文件')
  .option('-S, --safe-format', '只格式化美化后前后一致的ast tree')
  .option('-f, --force-write', '强制格式化，不推荐')
  .action(function (patterns, option) {
    let files

    if (option.checkMode === 'only-change' || option.checkMode === 'in-staged') {
      files = getFilesByMode(option.checkMode)
    } else {
      files = parseGlobPatterns(patterns)
    }

    const filesGroupedByExt = validExtFilesFilter(files)
    for(let ext of CAN_SUPPORT_EXT) {
      if (filesGroupedByExt[ext] && filesGroupedByExt[ext].length > 0) {
        const files = filesGroupedByExt[ext]
        if (ext === 'vue') {
          const format = new FormatVue(prettierConfigByExt[ext])
          foramtHanler(format, option, files)
        } else {
          const format = new Format(prettierConfigByExt[ext])
          foramtHanler(format, option, files)
        }
      }
    }

    return
  })

function foramtHanler(format, option, files) {
  if (option.listDifference === true) {
    const list =  format.listDifference(files)
    if (list.length === 0) {
      log.info('不存在需要格式化的文件')
      return 
    }
    log.info(`下列文件存在格式问题`)
    console.info(list.join('\n'))
    process.exitCode = 1
  }
  if (option.debugCheck === true) {
    const needCheckFiles = format.debugCheckFilter()
    if (needCheckFiles.length !== 0) {
      log.info('存在文件格式化前后AST(input) !== Ast(Ast(input))')
      console.info(needCheckFiles.join('\n'))
      process.exitCode = 1
    } else {
      log.info('不存在文件格式化前后AST(input) !== Ast(Ast(input))')
    }
  }
  if (option.safeFormat){
    return R.compose(format.format.bind(format), format.safetyFilter.bind(format), format.listDifference.bind(format))(files)
  }
  if (option.forceWrite) {
    return format.format(files)
  }
}

commander
  .command('init')
  .action(function(){
    initMain()
  })
commander
  .parse(process.argv)
