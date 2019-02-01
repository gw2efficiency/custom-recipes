const fs = require('fs')
const api = require('gw2api-client')

async function run () {
  const items = await api().items().all()
  fs.writeFileSync('./item-cache.json', JSON.stringify(items), 'utf-8')
}

run()
