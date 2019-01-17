const fs = require('fs')

console.log('Reading file')
const file = fs.readFileSync('./recipes.json', 'utf-8')
const overwrites = require('./helpers/getOverwrites')

console.log('Parsing file to JSON')
let json = JSON.parse(file)

console.log('Formatting recipes')
json = json.map(formatRecipe).filter(Boolean)

console.log('Writing to file')
const jsonString = '[\n' + json.map(x => '  ' + JSON.stringify(x)).join(',\n') + '\n]'
fs.writeFileSync('./recipes.json', jsonString, 'utf-8')

function formatRecipe (recipe) {
  let result = {}

  const id = parseInt(recipe.id, 10)
  if (id > 0) {
    result.id = id
  }

  result.name = recipe.name
  result.output_item_id = recipe.output_item_id

  if (typeof overwrites[result.output_item_id] !== "undefined") {
    result.id = overwrites[result.output_item_id]
  }

  if (result.output_item_id < 0) {
    return false
  }

  result.output_item_count = recipe.output_item_count
  result.ingredients = recipe.ingredients.map(formatIngredient).filter(Boolean)

  if (result.ingredients.length === 0) {
    return false
  }

  result.disciplines = recipe.disciplines

  if (recipe.min_rating) {
    result.min_rating = recipe.min_rating
  }

  if (recipe.achievement_id) {
    result.achievement_id = recipe.achievement_id
  }

  return result
}

function formatIngredient (ingredient) {
  if (ingredient.item_id < 0) {
    return false
  }

  let result = {}
  result.count = ingredient.count
  result.item_id = ingredient.item_id

  return result
}
