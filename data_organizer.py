# organizes raw data into champ and item data
# only keeps items in item_data.json, which is set up by item_data_init.py
# only keeps items with > 0 plays
# calculates playrates/winrates
# sorts champs' items and items' champs
# only keeps secondary data with > 2% playrate


from settings import *
from operator import itemgetter

# raw data from analyzer.py
f = open(data_path + 'raw_data.json')
raw_data = json.load(f)

# empty json files to be filled, from *_data_init.py
f = open(empty_data_path + 'empty_champ_data.json')
champ_data = json.load(f)

f = open(empty_data_path + 'empty_item_data.json')
item_data = json.load(f)
allowed_item_list = list(item_data.keys())

f = open(empty_data_path + 'empty_matches_analyzed.json')
matches_analyzed = json.load(f)

# riot data on champs and items, for getting name from id
riot_data = {'5.11' : {}, '5.14' : {}}

riot_data['5.11'] = {'champs' : {}, 'items' : {}}
riot_data['5.14'] = {'champs' : {}, 'items' : {}}

f = open(riot_data_path + '5.11/champs_by_id.json')
riot_data['5.11']['champs'] = json.load(f)['data']
f = open(riot_data_path + '5.14/champs_by_id.json')
riot_data['5.14']['champs'] = json.load(f)['data']

f = open(riot_data_path + '5.11/items.json')
riot_data['5.11']['items'] = json.load(f)['data']
f = open(riot_data_path + '5.14/items.json')
riot_data['5.14']['items'] = json.load(f)['data']

# returns top 10 keys by plays
def get_top (d, sort_value) :
    d_sorted = {};
    for key in list(d.keys()) :
        if sort_value == 'winrate' and d[key]['playrate'] < 2:
            continue
        d_sorted[key] = d[key][sort_value]
    return sorted(d_sorted, key=d_sorted.get, reverse = True)

for patch in patches :
    for queue in queues :
        total_matches = raw_data[patch][queue]['matches_analyzed']
        matches_analyzed[patch][queue] = total_matches

        # shortcuts
        raw_items = raw_data[patch][queue]['item_stats']
        raw_champs = raw_data[patch][queue]['champ_stats']

        for champ_id in raw_champs :
            champ_key = riot_data[patch]['champs'][champ_id]['key']
            champ_plays = raw_champs[champ_id]['plays']
            champ_wins = raw_champs[champ_id]['wins']
            champ_data[champ_key]['stats'][patch][queue]['plays'] = champ_plays
            champ_data[champ_key]['stats'][patch][queue]['wins'] = champ_wins
            champ_data[champ_key]['stats'][patch][queue]['playrate'] = round(100 * champ_plays / total_matches, 1)
            champ_data[champ_key]['stats'][patch][queue]['winrate'] = round(100 * champ_wins / champ_plays, 1)
            
            raw_item_stats = raw_champs[champ_id]['item_stats'] #shortcut
            # delete items not allowed, add others to data
            item_keys = list(raw_item_stats.keys())
            for item_id in item_keys : 
                if item_id not in allowed_item_list :
                    del raw_item_stats[item_id]
                else :
                    champ_data[champ_key]['items'][patch][queue][item_id] = {};
                    item_plays = raw_item_stats[item_id]['plays']
                    item_wins = raw_item_stats[item_id]['wins']
                    champ_data[champ_key]['items'][patch][queue][item_id]['plays'] = item_plays
                    champ_data[champ_key]['items'][patch][queue][item_id]['wins'] = item_wins
                    champ_data[champ_key]['items'][patch][queue][item_id]['playrate'] = round(100 * item_plays / champ_plays, 1)
                    champ_data[champ_key]['items'][patch][queue][item_id]['winrate'] = round(100 * item_wins / item_plays, 1)

        for item_id in raw_items :
            if item_id in allowed_item_list :
                item_plays = raw_items[item_id]['plays']
                item_wins = raw_items[item_id]['wins']
                item_data[item_id]['stats'][patch][queue]['plays'] = item_plays
                item_data[item_id]['stats'][patch][queue]['wins'] = item_wins
                item_data[item_id]['stats'][patch][queue]['playrate'] = round(100 * item_plays / total_matches, 1)
                item_data[item_id]['stats'][patch][queue]['winrate'] = round(100 * item_wins / item_plays, 1)

                raw_item_stats = raw_items[item_id]['champ_stats'] #shortcut
                champ_keys = list(raw_item_stats.keys())
                for champ_id in champ_keys : 
                    champ_key = riot_data[patch]['champs'][champ_id]['key']
                    item_data[item_id]['champs'][patch][queue][champ_key] = \
                        champ_data[champ_key]['items'][patch][queue][item_id]

        for champ_key in champ_data :
            # add champ's top items arrays
            top_playrate = get_top(champ_data[champ_key]['items'][patch][queue], 'playrate')
            top_winrate = get_top(champ_data[champ_key]['items'][patch][queue], 'winrate')
            champ_data[champ_key]['items'][patch][queue]['top_playrate'] = top_playrate
            champ_data[champ_key]['items'][patch][queue]['top_winrate'] = top_winrate

        for item_id in item_data :
            # add item's top champs arrays
            top_playrate = get_top(item_data[item_id]['champs'][patch][queue], 'playrate')
            top_winrate = get_top(item_data[item_id]['champs'][patch][queue], 'winrate')
            item_data[item_id]['champs'][patch][queue]['top_playrate'] = top_playrate
            item_data[item_id]['champs'][patch][queue]['top_winrate'] = top_winrate

# remove all items with 0 plays
for item_id in list(item_data.keys()) :
    total_plays = 0;
    for patch in patches :
        for queue in queues :
            total_plays += item_data[item_id]['stats'][patch][queue]['plays']
    if total_plays == 0 :
        del item_data[item_id]

# write to json files, with sorting
f = open(web_path + 'data/champ_data.json', 'w')
f.write(json.dumps(champ_data, sort_keys = True))

f = open(web_path + 'data/item_data.json', 'w')
f.write(json.dumps(item_data, sort_keys = True))

f = open(web_path + 'data/matches_analyzed.json', 'w')
f.write(json.dumps(matches_analyzed))






