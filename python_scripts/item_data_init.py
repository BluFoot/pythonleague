from settings import *

static_data = {'5.11' : {}, '5.14' : {}}

f = open('/Users/alex/Documents/league_api_challenge/data/riot/5.11/items.json')
static_data['5.11'] = json.load(f)['data']
f = open('/Users/alex/Documents/league_api_challenge/data/riot/5.14/items.json')
static_data['5.14'] = json.load(f)['data']

item_data = {}

boot_enchants = ['Enchantment: Teleport', 'Enchantment: Furor', 'Enchantment: Distortion', 'Enchantment: Homeguard', 'Enchantment: Alacrity', 'Enchantment: Captain']

for patch in patches :
    for key in static_data[patch] :
        item = static_data[patch][key]
        name = item['name']
        tags = []
        if 'tags' in item :
            tags = item['tags']

        boots2 = False
        goldbase = False

        # conditions to not include item
        small_key = key < '3000'
        ingredient = 'into' in item
        sighstone = 'Sightstone' in name
        if 'tags' in item :
            boots2 = 'Boots' in item['tags'] and name != 'Boots of Speed'
        if 'group' in item :
            goldbase = 'GoldBase' in item['group']    
        exclusions = small_key or (name in boot_enchants) or ('Trinket' in name) or ('The Black Spear' in name) or ingredient
        #exclusions = False
        inclusions = sighstone or boots2 or goldbase
        if exclusions and not inclusions:
            continue

        item_data[key] = {}
        item_data[key]['id'] = key 
        item_data[key]['name'] = name
        item_data[key]['tags'] = tags

        item_data[key]['stats'] = {'5.11': {}, '5.14': {}}
        for patch2 in patches :
            item_data[key]['stats'][patch2] = {'normal_5x5': {}, 'ranked_solo': {}}
            for queue in queues :
                item_data[key]['stats'][patch2][queue] = {'playrate': 0, 'winrate': 0, 'winrate_diff': 0}

        item_data[key]['champs'] = {'5.11': {}, '5.14': {}}
        for patch2 in patches :
            item_data[key]['champs'][patch2] = {'normal_5x5': {}, 'ranked_solo': {}}

f = open(project_path + 'data/empty/empty_item_data.json', 'w')
f.write(json.dumps(item_data))