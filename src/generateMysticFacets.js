const fs = require('fs')

const MYSTIC_FACET = 101540
const PILE_OF_LUCENT_CRYSTAL = 89271

function run() {
  const recipes = generateGemstoneRecipes()
  console.log(`Generated ${recipes.length} recipes`)

  // Load the recipe file
  let recipeFile = JSON.parse(fs.readFileSync('./recipes.json', 'utf-8'))
  console.log('Read recipe file')

  // Remove the old recipes & add new recipes
  recipeFile = recipeFile.filter(x => x.output_item_id !== MYSTIC_FACET)
  recipeFile = recipeFile.concat(recipes)
  console.log('Updated recipe file')

  // Write the recipe file
  const jsonString =
    '[\n' + recipeFile.map(x => '  ' + JSON.stringify(x)).join(',\n') + '\n]\n'
  fs.writeFileSync('./recipes.json', jsonString, 'utf-8')
  console.log('Wrote recipe file')
}

function generateGemstoneRecipes() {
  const items = JSON.parse(fs.readFileSync('./item-cache.json', 'utf-8'))

  const relics = items.filter(({type, rarity}) => ['Mwcc', 'Relic'].includes(type) & rarity === 'Exotic')

  const craftableIds = [
    ...JSON.parse(fs.readFileSync('./official-recipe-cache.json', 'utf-8')),
    ...JSON.parse(fs.readFileSync('./recipes.json', 'utf-8'))
  ].map(({output_item_id}) => output_item_id)

  const craftableRelics = relics.filter(({id}) => craftableIds.includes(id))
  const uncraftableRelics = relics.filter(({id}) => !craftableIds.includes(id))

  console.log(`Ignoring ${uncraftableRelics.length} uncraftable relics:`)
  uncraftableRelics.forEach(({name, type}) => console.log({name, type}))
  console.log()

  console.log(`Found ${craftableRelics.length} craftable relics:`)
  craftableRelics.forEach(({name, type}) => console.log({name, type}))

  return craftableRelics.map(({id}) => ({
    'name': 'Mystic Facet',
    'output_item_id': MYSTIC_FACET,
    'output_item_count': 1,
    'ingredients': [
      {'count': 1, 'type': 'Item', id},
      {'count': 250, 'type': 'Item', 'id': PILE_OF_LUCENT_CRYSTAL},
      {'count': 250, 'type': 'Item', 'id': PILE_OF_LUCENT_CRYSTAL},
      {'count': 250, 'type': 'Item', 'id': PILE_OF_LUCENT_CRYSTAL}
    ],
    'disciplines': ['Mystic Forge']
  }))
}

run()
