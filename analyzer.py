import json
import os

champion_stats = {}

for match_id in os.listdir('/Users/alex/Documents/programming/data/5.11/normal_5x5/br/') :
    if not(match_id.endswith('.json')) :
        continue
    f = open('/Users/alex/Documents/programming/data/5.11/normal_5x5/br/' + match_id)
    match = json.load(f)
    for i in range(10) :
        champion_id = match['participants'][i]['championId']
        if match['participants'][i]['stats']['winner'] is True :
            win = 1
        else : 
            win = 0
        if champion_id in champion_stats :
            champion_stats[champion_id] = (champion_stats[champion_id][0] + win, champion_stats[champion_id][0] + 1)
        else :
            champion_stats[champion_id] = (win, 1)

print(champion_stats)