import json, requests, subprocess, sys

file_name = 'recipes.json'


# Format recipes in the default way
def format_recipes(recipes):
    return {recipe['output_item_id']: {'output_item_id': recipe['output_item_id'],
                                       'output_item_count': recipe['output_item_count'],
                                       'ingredients': recipe['ingredients']}
            for recipe in recipes}


# Get all recipe items
def recipe_items(recipes):
    return [recipe['output_item_id'] for recipe in recipes] \
           + [ingredient['item_id'] for recipe in recipes for ingredient in recipe['ingredients']]


# Print a recipe as markdown
def print_recipe(recipe, items):
    string = '1. ' + str(recipe['output_item_count']) + 'x ' \
             + items.get(recipe['output_item_id'], '???') \
             + ' `' + str(recipe['output_item_id']) + '`' + "\n"

    for ingredient in recipe['ingredients']:
        string += '    - ' + str(ingredient['count']) + 'x ' \
                  + items.get(ingredient['item_id'], '???') \
                  + ' `' + str(ingredient['item_id']) + '`' + "\n"

    return string


# Grab the currently known recipes
with open(file_name) as data_file:
    data_old = json.load(data_file)

# Grab the json file with new recipes from the command line specified file
with open(sys.argv[1:][0]) as data_file:
    data_new = json.load(data_file)

formatted_new = format_recipes(data_new)
formatted_old = format_recipes(data_old)

# See what's new
new_keys = set(formatted_new.keys()) - set(formatted_old.keys())
new_recipes = [recipe for id, recipe in formatted_new.iteritems() if id in new_keys]

# See what's different
same_keys = set(formatted_new.keys()) & set(formatted_old.keys())
changed_recipes = [recipe for id, recipe in formatted_new.iteritems() if
                   id in same_keys and formatted_new[id] != formatted_old[id]]

# Output some stats
print 'Same recipes: %d' % (len(same_keys) - len(changed_recipes))
print 'New recipes: %d' % len(new_recipes)
print 'Changed recipes: %d' % len(changed_recipes)
print 'Missing recipes: %d' % len(set(formatted_old.keys()) - set(formatted_new.keys()))

# Write to files
with open('b-differences-new.json', 'w') as outfile:
    json.dump(new_recipes, outfile, indent=4, sort_keys=True)

with open('c-differences-changed.json', 'w') as outfile:
    json.dump(changed_recipes, outfile, indent=4, sort_keys=True)

# Grab all the item id, so we can resolve them into names
ids = set(recipe_items(new_recipes) + recipe_items(changed_recipes))
resp = requests.get(url='http://gw2-api.com/items/?ids=' + ','.join(str(x) for x in ids))
items = {item['id']: item['name'] for item in json.loads(resp.text) if item is not False}

# Generate human readable output (markdown)
string = "# New in other file\n\n"
for recipe in new_recipes:
    string += print_recipe(recipe, items)

string += "\n\n"

string += "# Different in other file\n\n"
for recipe in changed_recipes:
    string += print_recipe(recipe, items)

with open('a-differences.md', 'w') as outfile:
    outfile.write(string.encode('utf8'))