import json, requests, subprocess, sys

file_name = 'recipes.json'

# Grab the currently known recipes
with open(file_name) as data_file:
    data_old = json.load(data_file)

# Grab the json file with new recipes from the command line specified file
with open(sys.argv[1:][0]) as data_file:
    data_new = json.load(data_file)


# Format recipes in the default way
def format_recipes(recipes):
    return {recipe['output_item_id']: {'output_item_id': recipe['output_item_id'],
                                       'output_item_count': recipe['output_item_count'],
                                       'ingredients': recipe['ingredients']}
            for recipe in recipes}


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
with open('differences-new.json', 'w') as outfile:
    json.dump(new_recipes, outfile, indent=4, sort_keys=True)

with open('differences-changed.json', 'w') as outfile:
    json.dump(changed_recipes, outfile, indent=4, sort_keys=True)