const fs = require('fs')
const api = require('gw2api-client')

async function run () {
  const items = await api().recipes().all()
  fs.writeFileSync('./official-recipe-cache.json', JSON.stringify(items), 'utf-8')
}

run()
