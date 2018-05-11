const crypto = require('crypto')

function hashRecipe (recipe) {
  recipe = JSON.parse(JSON.stringify(recipe))
  recipe.ingredients.sort((a, b) => a.item_id - b.item_id)
  return hash(JSON.stringify(recipe))
}

function hash (string) {
  return crypto.createHash('sha1').update(string).digest('base64')
}

module.exports = hashRecipe
