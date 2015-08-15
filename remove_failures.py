import json
import os

for match_id in os.listdir('/Users/alex/Documents/programming/data/5.11/normal_5x5/br/') :
    # ensure it's a .json file
    if not(match_id.endswith('.json')) :
        continue

    file_name = '/Users/alex/Documents/programming/data/5.11/normal_5x5/br/' + match_id
    f = open(file_name)
    if f.readline() is '<html>\n'
        os.remove(file_name)