const fs = require('fs')

const overwrites = fs.readFileSync('./official-id-overwrite.txt', 'utf-8')

let map = {}
overwrites
  .split('\n')
  .map(row => {
    row = row
      .replace(/^.+\((.+)\) => (.+)$/, '$1,$2')
      .split(',')
      .map(x => parseInt(x, 10))

    map[row[0]] = row[1]
  })

module.exports = map
