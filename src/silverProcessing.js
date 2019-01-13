const fs = require('fs');
run();

function run () {
    console.log('Reading file');
    const file = fs.readFileSync('./recipes.json', 'utf-8');

    console.log('Parsing file to JSON');
    let json = JSON.parse(file);

    let results = [];
    let items = {};
    console.log("Start");
    for(let i=0;i<json.length;i++){
        let pushToResults = true;
        if(json[i].output_item_id === 68063){
            // clears all gemstone recipes
            //pushToResults = false;continue;
            // clears only recipes that  use random gems for the slots
            if(!processGemstones(json[i])){pushToResults = false; continue;}
        }
        if(pushToResults){results.push(json[i])}
        if(typeof items[json[i].output_item_id] === "undefined"){items[json[i].output_item_id] = {"name":json[i].name, "count":0};}
        items[json[i].output_item_id].count++;
    }
    let itemNames = Object.keys(items);
    for(let i=0;i<itemNames.length;i++){
        if(items[itemNames[i]].count <= 5){
            delete items[itemNames[i]]
        }
    }
    results = createGemstoneRecipes(results);
    fs.writeFileSync(`./recipes.json`, JSON.stringify(results, null, 2), 'utf-8');
    fs.writeFileSync(`./silver_items.json`, JSON.stringify(items, null, 2), 'utf-8');
    console.log("Before/after", json.length ,  results.length)
}

function processGemstones(recipe){
    let dust = 24277;
    let ecto = 19721;
    let firstID = 0;

    let result = true;
    for(let j=0;j<recipe.ingredients.length;j++){
        let id = recipe.ingredients[j].item_id;
        if(id === dust){continue;}
        if(id === ecto){continue;}
        if(firstID === 0){ firstID = id; continue;}
        if(id !== firstID){result = false;}
    }
    return result;
}

function createGemstoneRecipes(results){
    let baseItems = [
        // add new orbs ID's in (on a new line) below this to generate the recipes
        //24514,24518,24532,24533,24524,72436,42010,24520,76491,24512,24510,75654,24515,74988,76179,72315,70957,72504,24522,24508,24516,24884,24502,24772,24773
    ];

    for(let i=0;i<baseItems.length;i++){
        // 10% chance of getting 5 and 25 respectfully
        let dust = {"name":"Amalgamated Gemstone","output_item_id":68063,"output_item_count":1.4,"ingredients":[{"count":1,"item_id":24277}],"disciplines":["Mystic Forge"]};
        let ecto = {"name":"Amalgamated Gemstone","output_item_id":68063,"output_item_count":11.5,"ingredients":[{"count":5,"item_id":19721}],"disciplines":["Mystic Forge"]};

        dust.ingredients.push({"count":3,"item_id":baseItems[i]});
        dust.ingredients.push({"count":3,"item_id":baseItems[i]});
        dust.ingredients.push({"count":3,"item_id":baseItems[i]});
        results.push(dust);

        ecto.ingredients.push({"count":25,"item_id":baseItems[i]});
        ecto.ingredients.push({"count":25,"item_id":baseItems[i]});
        ecto.ingredients.push({"count":25,"item_id":baseItems[i]});
        results.push(ecto);
    }
    return results;
}