import json, requests, subprocess

api_url = 'http://gw2profits.com/json/v3/forge/'
file_name = 'recipes.json'

# Grab the recipes from the API
resp = requests.get(url=api_url)

if resp.status_code != 200:
    print 'API error: Response has status != 200'
    exit()

# Parse the JSON
data = json.loads(resp.text)

prePrecursors = [
    75163,  # Perfected Daysword
    70853,  # Dawn Experiment
    75618,  # Perfected Nightsword
    75592,  # Dusk Experiment
    74468,  # Perfected Trident
    72629,  # Venom Experiment
    77156,  # Perfected Dagger
    72827,  # Spark Experiment
    74010,  # Perfected Warhorn
    71345,  # Howl Experiment
    76027,  # Perfected Staff
    73431,  # The Legend Experiment
    75399,  # Perfected Short Bow
    77097,  # The Lover Experiment
    73023,  # Perfected Pistol
    75846,  # Chaos Gun Experiment
    77118,  # Perfected Sword
    74093,  # Zap Experiment
    74020,  # Perfected Mace
    70610,  # The Energizer Experiment
    70805,  # Perfected Spear
    72748,  # Carcharias Experiment
    70417,  # Perfected Focus
    72167,  # The Bard Experiment
    71886,  # Perfected Scepter
    74655,  # Storm Experiment
    71910,  # Perfected Axe
    76795,  # Tooth of Frostfang Experiment
    71847,  # Perfected Shield
    74275,  # The Chosen Experiment
    70814,  # Perfected Longbow
    73382,  # Kudzu Experiment
    73785,  # Perfected Rifle
    71078,  # The Hunter Experiment
    75949,  # Perfected Harpoon Gun
    73087,  # Rage Experiment
    72245,  # Perfected Torch
    70566,  # Rodgort's Flame Experiment
    71134,  # Perfected Hammer
    74163,  # The Colossus Experiment
    70743,  # Development
    70960,  # Research
    75974,  # The Apparatus
    70989,  # The Device
    76582,  # Ravenswood Staff
    75467,  # Ravenswood Branch
    78524,  # The Ambush
    78330  # The Hunt
]

for element in data:
    # Fix achievement ids
    if 'Achievement' not in element['disciplines']:
        element.pop('achievement_id', 0)
    # Fix output range
    if element['output_item_count_range'] == '':
        element.pop('output_item_count_range', 0)
    # Fix double included pre-precursors
    if len(element['ingredients']) > 1:
        element['ingredients'] = [ingredient for ingredient in element['ingredients']
                                  if ingredient['item_id'] not in prePrecursors]

# Write them formatted into a file
with open(file_name, 'w') as outfile:
    json.dump(data, outfile, indent=4, sort_keys=True)

# Check if the file changed
diff = subprocess.Popen("git diff " + file_name, shell=True, stdout=subprocess.PIPE).stdout.read()

# If yes, commit and push it to the repo, else do nothing
if len(diff) > 0:
    print diff
else:
    print "JSON file is the same"
