const querystring = require('querystring')
const fetch = require('node-fetch')

const BASE_API_URL = 'https://wiki.guildwars2.com/api.php?'

module.exports = getRecipes

async function getRecipes () {
  console.log('Reading recipes from the API')
  let recipes = await queryApi()

  console.log('Formatting recipes')
  recipes = recipes.map(formatRecipe).filter(Boolean)

  console.log(`${recipes.length} total recipes`)
  return recipes
}

async function queryApi (offset = 0) {
  const parameters = {
    action: 'askargs',
    format: 'json',
    conditions: 'Has recipe source::Mystic forge',
    printouts: 'Has ingredient with id|Has output quantity|Has output game id',
    parameters: `limit=500|offset=${offset}`
  }

  const url = BASE_API_URL + querystring.stringify(parameters)
  const response = await fetch(url).then(x => x.json())

  console.log(`Loaded page with offset ${offset}`)
  let results = Object.values(response.query.results)
  let moreResults = []

  if (response['query-continue-offset']) {
    moreResults = await queryApi(response['query-continue-offset'])
  }

  return results.concat(moreResults)
}

function formatRecipe (recipe) {
  let result = {}

  result.name = recipe.fulltext.replace(/#.+$/, '').replace(/\/.+$/, '')
  result.output_item_id = recipe.printouts['Has output game id'][0]
  result.output_item_count = recipe.printouts['Has output quantity'][0]
  result.ingredients = recipe.printouts['Has ingredient with id'].map(formatIngredient)
  result.disciplines = ['Mystic Forge']

  return result
}

function formatIngredient (ingredient) {
  let result = {}
  result.count = ingredient['Has ingredient quantity'].item[0]
  result.item_id = ingredient['Has ingredient id'].item[0]
  return result
}
