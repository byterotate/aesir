import * as path from 'path'

export function getPrettierCmd() {
    const isWindows = process.platform === 'win32'
    const prettier = isWindows ? 'prettier.cmd' : 'prettier'
    const prettierCmd = path.resolve(__dirname, '../node_modules/.bin/' + prettier)
    return prettierCmd
}