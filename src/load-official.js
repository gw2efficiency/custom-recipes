const fs = require('fs')
const fetch = require('node-fetch')
const PromiseThrottle = require('promise-throttle')

const reqThrottle = new PromiseThrottle({
  requestsPerSecond: 600 / 60,
  promiseImplementation: Promise
})

run()

async function run () {
  console.log('Reading file')
  const file = fs.readFileSync('./recipes.json', 'utf-8')

  console.log('Parsing file to JSON')
  let json = JSON.parse(file)

  console.log('Trying to resolve output ids to recipe ids on official API')
  let results = []

  const requests = json.map(element => (
    reqThrottle.add(async () => {
      const recipeIds = await getRecipeId(element.output_item_id)
      process.stdout.write('.')

      if (recipeIds) {
        results.push(`${element.name} (${element.output_item_id}) => ${recipeIds.join(', ')}`)
      }
    })
  ))

  await Promise.all(requests)

  console.log()
  console.log(results.join('\n'))
}

async function getRecipeId (itemId) {
  const url = `https://api.guildwars2.com/v2/recipes/search?output=${itemId}`
  const recipeIds = await fetch(url).then(x => x.json())

  return recipeIds.length > 0 ? recipeIds : false
}

