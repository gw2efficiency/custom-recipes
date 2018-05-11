const fs = require('fs')
const hashRecipes = require('./helpers/hashRecipe')

async function run (name) {
  console.log(`Loading differences in recipes from ${name}`)

  console.log('Reading recipes & ignored hashes')
  const existingRecipes = JSON.parse(fs.readFileSync('./recipes.json', 'utf-8'))
  const ignoredHashes = JSON.parse(fs.readFileSync('./ignored.json', 'utf-8'))

  console.log('Generating recipe hashes for existing')
  const existingRecipeHashes = existingRecipes.map(hashRecipes)

  console.log(`Running updater`)
  const updater = require(`./updaters/${name}.js`)
  let updaterRecipes = await updater()

  console.log('Filtering new recipes')
  updaterRecipes = updaterRecipes.filter(recipe => {
    const hash = hashRecipes(recipe)
    return !existingRecipeHashes.includes(hash) && !ignoredHashes.includes(hash)
  })
  console.log(`${updaterRecipes.length} new recipes`)

  console.log('Writing to temporary file (/.tmp/differences.json)')
  fs.writeFileSync(`./tmp/differences.json`, JSON.stringify(updaterRecipes, null, 2), 'utf-8')
}

run(process.argv[2])
