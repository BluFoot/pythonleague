import json
import os
import shutil

regions = ['br', 'eune', 'euw', 'kr', 'lan', 'las', 'na', 'oce', 'ru', 'tr']

for region in regions :
    print(region)
    for match_id in os.listdir('/Users/alex/Documents/programming/data/5.11/normal_5x5/' + region + '/') :
        print(region + ': ' + match_id)
        # ensure it's a .json file
        if not(match_id.endswith('.json')) :
            continue

        file_name = '/Users/alex/Documents/programming/data/5.11/normal_5x5/' + region + '/' + match_id
        f = open(file_name)
        if f.readline().startswith('<html>') :
            file_dest = '/Users/alex/Documents/programming/bad_data/5.11/normal_5x5/' + region + '/' + match_id
            shutil.move(file_name, file_dest)
        f.close()