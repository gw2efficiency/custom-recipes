const fetch = require('node-fetch')
const API_URL = 'http://gw2profits.com/json/v3/forge/'

module.exports = getRecipes

async function getRecipes () {
  console.log('Reading recipes from the API')
  let recipes = await fetch(API_URL).then(x => x.json())

  console.log('Formatting recipes')
  recipes = recipes.map(formatRecipe).filter(Boolean)

  console.log(`${recipes.length} total recipes`)
  return recipes
}

function formatRecipe (recipe) {
  let result = {}

  const id = parseInt(recipe.id, 10)
  if (id > 0) {
    result.id = id
  }

  result.name = recipe.name
  result.output_item_id = recipe.output_item_id

  if (result.output_item_id < 0) {
    return false
  }

  result.output_item_count = recipe.output_item_count
  result.ingredients = recipe.ingredients.map(formatIngredient).filter(Boolean)

  if (result.ingredients.length === 0) {
    return false
  }

  if (recipe.min_rating) {
    result.min_rating = recipe.min_rating
  }

  result.disciplines = recipe.disciplines

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
