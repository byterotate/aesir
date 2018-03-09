import chalk from 'chalk'

export const info = str => console.info(`${chalk.green('[info]')}${str}`)

export const warn = str => console.warn(`${chalk.yellow('[warn]')}${str}`)

export const error = str => console.warn(`${chalk.red('[error]')}${str}`)