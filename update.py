import json, requests, subprocess

api_url = 'http://gw2profits.com/json/v2/forrge/'
file_name = 'recipes.json'

# Grab the recipes from the API
resp = requests.get(url=api_url)

if resp.status_code != 200:
    print 'API error: Response has status != 200'
    exit()

# Parse the JSON
data = json.loads(resp.text)

# Write them formatted into a file
with open(file_name, 'w') as outfile:
    json.dump(data, outfile, indent=4, sort_keys=True)

# Check if the file changed
diff = subprocess.Popen("git diff " + file_name, shell=True, stdout=subprocess.PIPE).stdout.read()

# If yes, commit and push it to the repo, else do nothing
if len(diff) > 0:
    print "JSON file changed, committing..."
    print subprocess.Popen("git commit " + file_name + " -m \"[Automatic] Update JSON file\"", shell=True, stdout=subprocess.PIPE).stdout.read()
    print "Committed... pushing"
    print subprocess.Popen("git push", shell=True, stdout=subprocess.PIPE).stdout.read()
else:
    print "JSON file is the same"