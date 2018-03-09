import * as inquirer from 'inquirer'
import * as R from 'ramda'
import * as Path from 'path'
import * as fs from 'fs'
import * as ora from 'ora'
import { formatStr } from './format'
import { eslintBaseConfig } from './lib/config'
import { exec, mergeDeepWith } from './lib/helper'
import { EXPORT_DEV_DEPENDENCE } from './lib/constant'
import * as log from './lib/log'


const cwd = process.cwd()
const packagePath = Path.resolve(cwd, './package.json')
const packageLockFilePath = Path.resolve(cwd, './package-lock.json')
const eslintrcPath = Path.resolve(cwd, './.eslintrc.js')

const defaultConfig = mergeDeepWith(eslintBaseConfig, {
  extends: [ '@aesir/eslint-config-mandatory' ]
})

function removeDependencInLockFile (packageLockFilePath, dependences) {
  const packageLockFile = fs.readFileSync(packageLockFilePath, 'utf-8')
  const packageLockJSON = JSON.parse(packageLockFile)
  const keys = R.keys(dependences)
  const finalPackageLockJSON = R.omit(keys, packageLockJSON.dependencies||{})
  fs.writeFileSync(packageLockFilePath, JSON.stringify(finalPackageLockJSON))
  log.info(`移除原有eslint依赖成功`)
}


function testFileExsit (filename) {
  return fs.existsSync(filename)
}


function writeAndFormatEslintConfig (config) {
  const result = formatStr(`module.exports = ${JSON.stringify(config)}`)
  fs.writeFileSync(eslintrcPath, result)
}

export async function initMain () {
  if (!testFileExsit(packagePath)) {
    log.error(`未在该目录下找到package.json文件，请检查该文件是否存在或当前目录是否为项目根目录，或使用npm init 初始化项目`)
    process.exit(1)
  }
  if (testFileExsit(packageLockFilePath)) {
    removeDependencInLockFile(packageLockFilePath, EXPORT_DEV_DEPENDENCE)
  }
  try {
    const packageStr = fs.readFileSync(packagePath, 'utf-8')
    const packageJson = JSON.parse(packageStr)
    const finalPackageJson = R.mergeDeepRight(packageJson, {
      scripts: {
        "precommit": "themis lint -p -s -m in-staged",
        "format:in-staged": "themis format -S -m in-staged"
      },
      devDependencies: EXPORT_DEV_DEPENDENCE,
    })
    fs.writeFileSync(packagePath, JSON.stringify(finalPackageJson))
    const spinner = ora('安装项目依赖中...\n').start()
    const result = exec('npm', [
      'install',
    ])
    if (result.code) {
      spinner.fail('项目依赖安装失败，请手动执行npm install')
      process.exit(result.code)
    }
    spinner.succeed('项目依赖安装成功')
    if (testFileExsit(packagePath)) {
      const answer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'cover',
          message: '当前目录下已经存在.eslintrc.js文件，是否确认覆盖',
          default: false
        }
      ])
      if (answer.cover) {
        writeAndFormatEslintConfig(defaultConfig)
      }
      process.exit(0)
    } else {
      writeAndFormatEslintConfig(defaultConfig)
      process.exit(0)
    }
  } catch (error) {
    process.exit(1)
  }
}

