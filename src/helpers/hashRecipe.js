const crypto = require('crypto')

function hashRecipe (recipe) {
  recipe = JSON.parse(JSON.stringify(recipe))
  recipe.ingredients.sort((a, b) => a.id - b.id)
  recipe.ingredients.map(x => {
    x.item_id = x.id
    delete x.id
    delete x.type
    return x
  })
  return hash(JSON.stringify(recipe))
}

function hash (string) {
  return crypto.createHash('sha1').update(string).digest('base64')
}

module.exports = hashRecipe
