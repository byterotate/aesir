import * as shelljs from 'shelljs'
import * as diff from 'diff'
import * as R from 'ramda'
import * as glob from 'glob'
import * as Fs from 'fs'
import { filesArray } from './constraint'
import { CAN_SUPPORT_EXT } from './constant'

export function exec(command: string, args: Array<string>):any {
  // console.info('>' + [command].concat(args).join(' '))
  const result = shelljs.exec(`${command} ${args.join(' ')}`)
  return result
}

export function camelMapToUnderline(obj: object): object {
  return Object.keys(obj).reduce(function (acc, cur) {
    const key = cur.replace(/[A-Z]/g, '-' + '$&').toLowerCase()
    return Object.assign({}, acc, {
      ['--' + key]: obj[cur],
    })
  }, {})
}


export function parseGlobPatterns (patterns:Array<string>):filesArray {
  const globPattern = patterns.length > 1
  ? `{${patterns.join(',')}}`
  : `${patterns.join(',')}`
  return glob.sync(globPattern)
} 


export function getChangeFiles () {
  return (exec('git', [
    'diff',
    '-z',
    '--name-only',
    '--diff-filter=ACDMRTUXB*',
  ]).stdout.match(/[^\0]+/g)||[])
}


export function getStagedFiles () {
  return (exec('git', [
    'diff-index',
    '--cached',
    '--name-only',
    '--diff-filter=ACMRTUB',
    'HEAD',
  ]).stdout.match(/[^\n]+/g)||[])
}

export function getUntrackFiles () {
  return (exec('git', [
    'ls-files',
    '--others',
    '--exclude-standard',
  ]).stdout.match(/[^\n]+/g)||[])
}

export function filterDifferenceFiles (files):filesArray {
  const filterFiles = new Set(getChangeFiles())
  return R.filter(function (item) {
    return filterFiles.has(item)
  })(files)
}

export function createPatch(a,b) {
  return diff.createTwoFilesPatch("", "", a, b, "", "", {
    context: 2
  });
}


export function validExtFilesFilter (files) {
  return R.groupBy(function (filename) {
    let succFlag = false
    let validExt
    for (let ext of CAN_SUPPORT_EXT) {
      const reg = new RegExp(`.${ext}$`)
      if (reg.test(filename)) {
        succFlag = true
        validExt = ext
        break
      }
    }
    if (succFlag === true) {
      return validExt
    }
    console.warn(`该工具暂不支持此文件类型filename=${filename}, 此文件将在之后的处理中被忽略`)
  })(files)
}

export const filterJsFiles = R.filter(item => {
  if (/.js$/.test(item)) {
    return true
  }
  console.warn(`${item}不是js文件，将在之后的处理中被忽略`)
})

export function getFilesByMode (mode):filesArray {
  switch (mode) {
    case 'in-staged': const result = getStagedFiles();return result
    case 'only-change': return (getChangeFiles().concat(getUntrackFiles())).filter(filename => /.js$/.test(filename))
    default:
      return []
  }
}

export const mergeDeepWith = R.mergeDeepWith(R.compose(R.uniq, R.concat))


export function fileExsit(file:string):boolean {
  const isExsit = Fs.existsSync(file)
  if (!isExsit) {
    console.warn(`文件-${file}不存在`)
  }
  return isExsit
}