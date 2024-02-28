const fs = require('fs')
const api = require('gw2api-client')
const fetch = require('node-fetch')

async function run () {
  const unofficialItems = await fetch('https://api.gw2efficiency.com/items?ids=all').then(x => x.json())
  fs.writeFileSync('./unofficial-item-cache.json', JSON.stringify(unofficialItems), 'utf-8')
  console.log('Saved unofficial-item-cache.json')

  const items = await api().items().all()
  fs.writeFileSync('./item-cache.json', JSON.stringify(items), 'utf-8')
  console.log('Saved item-cache.json')
}

run()
