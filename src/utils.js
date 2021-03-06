const childProcess = require('child_process')
const fs = require('fs')
const util = require('util')
const du = util.promisify(require('du'))

const isWin = /^win/.test(process.platform)

const exec = util.promisify(childProcess.exec)

function getByteSize (sizeStr) {
  const size = Number(sizeStr.substr(0, sizeStr.length - 1))
  const metric = sizeStr.substr(sizeStr.length - 1)
  let byteSize = size
  switch (metric) {
    case 'K':
      byteSize *= 1024
      break
    case 'M':
      byteSize *= 1024 * 1024
      break
    case 'G':
      byteSize *= 1024 * 1024 * 1024
      break
    case 'T':
      byteSize *= 1024 * 1024 * 1024 * 1024
      break
  }
  return byteSize
}

exports.getByteSize = getByteSize
exports.exec = exec
exports.readdir = util.promisify(fs.readdir)
exports.lstat = util.promisify(fs.lstat)
exports.lstat = util.promisify(fs.lstat)
exports.du = file => {
  if (isWin) {
    return du(file, { disk: true })
  }
  return exec(`du -sh ${file}`).then(result =>
    getByteSize(result.stdout.split('\t')[0])
  )
}
