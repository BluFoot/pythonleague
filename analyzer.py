from settings import *
import json
import os

stats = {}      # plays/wins of champs/items
stats_calc = {}     # playrates/winrates of champs/items
matches_analyzed = 0        #total matches analyzed
matches_in_region = 0
patch = '5.14'
queue = 'normal_5x5'
regions = ['br', 'eune', 'euw']

for region in regions :
    print(region)
    matches_in_region = 0
    for match_id in os.listdir(good_data_path + patch + '/' + queue + '/' + region + '/') :
        matches_in_region += 1
        matches_analyzed += 1
        if (matches_in_region % 1000 == 0) :
            print(matches_in_region)

        # ensure it's a .json file
        if not(match_id.endswith('.json')) :
            continue

        f = open(good_data_path + patch + '/' + queue + '/' + region + '/' + match_id)
        match = json.load(f)
        f.close()

        # for all 10 participants
        for i in range(10) :
            items = []
            # get info from match file
            champ_id = match['participants'][i]['championId']
            for j in range(7) : 
                items.append(match['participants'][i]['stats']['item' + str(j)])
            win = int(match['participants'][i]['stats']['winner'])

            # if champ is in stats, modify it, otherwise add it
            if champ_id in stats :
                stats[champ_id]['plays'] += 1
                stats[champ_id]['wins'] += win
            else :
                stats[champ_id] = {'plays' : 1, 'wins' : win, 'item_stats': {}}
            # same thing for items
            for item_id in items :
                # item_id == 0 means empty item slot
                if item_id == 0 :
                    continue
                if item_id in stats[champ_id]['item_stats'] :
                    stats[champ_id]['item_stats'][item_id]['plays'] += 1
                    stats[champ_id]['item_stats'][item_id]['wins'] += win
                else :
                    stats[champ_id]['item_stats'][item_id] = {'plays' : 1, 'wins' : win}          

# save to file
f = open(project_path + 'data/stats/' + patch + '_' + queue + '_' + 'stats.txt', 'w')
f.write(str(stats))
print(str(matches_analyzed) + ' games analyzed')