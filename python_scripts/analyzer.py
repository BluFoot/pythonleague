from settings import *

import os
import sys
import ujson as json

try :
    patch = sys.argv[1]
    queue = sys.argv[2]
except IndexError :
    print('usage : analyzer.py <patch> <queue>')
    sys.exit(2)

if not(patch in patches) or not(queue in queues) :
    print('incorrect patch or queue')
    sys.exit(2)

# dictionary where we story all our data
raw_data = {'champ_stats': {}, 'item_stats': {}, 'matches_analyzed': 0}
# shortcuts
champ_stats = raw_data['champ_stats']
item_stats = raw_data['item_stats']

for region in regions :
    print(region)
    matches_in_region = 0
    for match_id in os.listdir(good_data_path + patch + '/' + queue + '/' + region + '/') :
        matches_in_region += 1
        raw_data['matches_analyzed'] += 1
        if matches_in_region % 1000 == 0 :
            print(matches_in_region)

        # ensure it's a .json file
        if not(match_id.endswith('.json')) :
            continue

        f = open(good_data_path + patch + '/' + queue + '/' + region + '/' + match_id)
        match = json.load(f)
        f.close()

        # for all 10 participants
        for i in range(10) :
            tier = match['participants'][i]['highestAchievedSeasonTier']

            items = [0, 0, 0, 0, 0, 0, 0]
            # get info from match file
            champ_id = match['participants'][i]['championId']
            for j in range(7) : 
                items[j] = (match['participants'][i]['stats']['item' + str(j)])
            win = int(match['participants'][i]['stats']['winner'])

            ## champ stats
            # if champ is already in champ_stats, modify it, otherwise create new entry
            try :
                champ_stats[champ_id]['plays'] += 1
                champ_stats[champ_id]['wins'] += win
            except KeyError :
                champ_stats[champ_id] = {'plays' : 1, 'wins' : win, 'item_stats': {}}
            # champ's item stats, similar process
            for item_id in items :
                # item_id == 0 means empty item slot
                if item_id == 0 :
                    continue
                try :
                    champ_stats[champ_id]['item_stats'][item_id]['plays'] += 1
                    champ_stats[champ_id]['item_stats'][item_id]['wins'] += win
                except KeyError :
                    champ_stats[champ_id]['item_stats'][item_id] = {'plays' : 1, 'wins' : win}

            ## item stats
            for item_id in items :
                # item_id == 0 means empty item slot
                if item_id == 0 :
                    continue
                # if item is already in item_stats, modify it, otherwise create new entry
                try :
                    item_stats[item_id]['plays'] += 1
                    item_stats[item_id]['wins'] += win
                except KeyError :
                    item_stats[item_id] = {'plays' : 1, 'wins' : win, 'champ_stats': {}}      
                # item's champ stats, similar process
                try :
                    item_stats[item_id]['champ_stats'][champ_id]['plays'] += 1
                    item_stats[item_id]['champ_stats'][champ_id]['wins'] += win
                except KeyError :
                    item_stats[item_id]['champ_stats'][champ_id] = {'plays' : 1, 'wins' : win}    

# output to raw_data.json, overwriting previous data
f = open(project_path + 'data/raw_data.json')
raw_data_cur = json.load(f)
raw_data_cur[patch][queue] = raw_data
f = open(project_path + 'data/raw_data.json', 'w')
f.write(json.dumps(raw_data_cur))











