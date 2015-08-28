from settings import *

static_data = {'5.11' : {}, '5.14' : {}}

f = open('/Users/alex/Documents/league_api_challenge/data/riot/5.11/champs.json')
static_data['5.11'] = json.load(f)['data']
f = open('/Users/alex/Documents/league_api_challenge/data/riot/5.14/champs.json')
static_data['5.14'] = json.load(f)['data']

champ_data = {}

for patch in patches :
    for key in static_data[patch] :
        champ = static_data[patch][key]
        champ_id = champ['id']
        name = champ['name']
        title = champ['title']
        tags = champ['tags']
        skins = len(champ['skins'])

        champ_data[key] = {}
        champ_data[key]['id'] = champ_id
        champ_data[key]['key'] = key 
        champ_data[key]['name'] = name
        champ_data[key]['tags'] = tags
        champ_data[key]['skins'] = skins
        
        champ_data[key]['stats'] = {'5.11': {}, '5.14': {}}
        for patch2 in patches :
            champ_data[key]['stats'][patch2] = {'normal_5x5': {}, 'ranked_solo': {}}
            for queue in queues :
                champ_data[key]['stats'][patch2][queue] = {'playrate': 0, 'winrate': 0, 'winrate_diff': 0}

        champ_data[key]['items'] = {'5.11': {}, '5.14': {}}
        for patch2 in patches :
            champ_data[key]['items'][patch2] = {'normal_5x5': {}, 'ranked_solo': {}}

f = open(project_path + 'data/empty/empty_champ_data.json', 'w')
f.write(json.dumps(champ_data))