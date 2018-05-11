const fs = require('fs')
const validateRecipe = require('./validateRecipe')

function validate () {
  console.log('Reading file')
  const file = fs.readFileSync('./recipes.json', 'utf-8')

  console.log('Parsing file to JSON')
  const json = JSON.parse(file)

  console.log('Validating recipes')
  console.log()
  const errors = json
    .map((x, i) => validateRecipe(x, i + 2))
    .filter(Boolean)

  if (errors.length > 0) {
    console.log(`Exiting with errors in ${errors.length} recipes`)
    process.exit(1)
  } else {
    console.log('Validation passed!')
  }
}

validate()
