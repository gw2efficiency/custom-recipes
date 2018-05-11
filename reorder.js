const fs = require('fs')

function validate () {
  console.log('Reading file')
  const file = fs.readFileSync('./recipes.json', 'utf-8')

  console.log('Parsing file to JSON')
  let json = JSON.parse(file)

  console.log('Reordering recipe keys')
  json = json.map(reorderRecipe).filter(Boolean)

  console.log('Writing to file')
  const jsonString = '[\n' + json.map(x => '  ' + JSON.stringify(x)).join(',\n') + '\n]'
  fs.writeFileSync('recipes-reordered.json', jsonString, 'utf-8')
}

function reorderRecipe (recipe) {
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
  result.ingredients = recipe.ingredients.map(reorderIngredient).filter(Boolean)

  if (result.ingredients.length === 0) {
    return false
  }

  if (recipe.min_rating) {
    result.min_rating = recipe.min_rating
  }

  result.disciplines = recipe.disciplines

  return result
}

function reorderIngredient (ingredient) {
  if (ingredient.item_id < 0) {
    return false
  }

  return ingredient
}

validate()
