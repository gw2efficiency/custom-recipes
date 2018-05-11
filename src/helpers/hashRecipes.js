const crypto = require('crypto')

function hashRecipe (recipe) {
  return hash(JSON.stringify(recipe))
}

function hash (string) {
  return crypto.createHash('sha1').update(string).digest('base64')
}

module.exports = hashRecipe
