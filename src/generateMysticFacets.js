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
  let recipes = []

  const items = JSON.parse(fs.readFileSync('./item-cache.json', 'utf-8'))

  const relics = items.filter(({type}) => ['Mwcc', 'Relic'].includes(type))

  console.log(`Found ${relics.length} relics:`)
  relics.forEach(({name, type}) => console.log({name, type}))

  relics.forEach(({id}) => {
    recipes.push({
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
    })
  })

  return recipes
}

run()
