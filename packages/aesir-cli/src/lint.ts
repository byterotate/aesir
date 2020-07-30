import * as Fs from 'fs'
import * as R from 'ramda'
import * as eslint from 'eslint'
import { eslintBaseConfig, prettierConfig } from "./lib/config"
import { mergeDeepWith } from './lib/helper'

const CLIEngine = eslint.CLIEngine

const formatConfig = {
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', prettierConfig],
  },
}

export function genarateConfig(command) {
  let config = eslintBaseConfig
  const path = `/tmp/eslintrc_${+new Date()}`
  if ((command & 1) === 1) {
    config = mergeDeepWith(config, formatConfig)
  }
  if ((command & 2) === 2) {
    config = mergeDeepWith(config, {extends:['aesir-eslint-config-mandatory']})
  }
  if ((command & 4) === 4) {
    config = mergeDeepWith(config, {extends:['aesir-eslint-config-recommand']})
  }
  Fs.writeFileSync(path, JSON.stringify(config))
  return [path, config]
}


function cascadeConfigHandler (config) {
  const {
    rules,
    extends:any,
    globals,
    ...restConfig
  } = config
  return {
    ...restConfig,
    globals: R.pickBy(val => val === true)(globals)
  }
}

export function eslintCheck (path, files, isQuiet: boolean = false) {

  const baseCli = new CLIEngine({})

  const baseConfig = cascadeConfigHandler(baseCli.getConfigForFile(files[0]))
  const cli = new CLIEngine({
    baseConfig,
    configFile: path,
    useEslintrc: false,
  })

  const formatter = cli.getFormatter()
  const report = cli.executeOnFiles(files)
  let results = report.results
  if (isQuiet) {
    results = CLIEngine.getErrorResults(results)
  }
  console.info(formatter(results))
  const errorCode = report.errorCount?1:0
  return errorCode
}




