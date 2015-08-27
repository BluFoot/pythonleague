from settings import *
import os
import shutil
import sys

try :
    patch = sys.argv[1]
    queue = sys.argv[2]
except IndexError :
    print('usage : analyzer.py <patch> <queue>')
    sys.exit(2)

if not(patch in patches) or not(queue in queues) :
    print('incorrect patch or queue')
    sys.exit(2)

failures = 0

for region in regions :
    i = 0
    for match_id in os.listdir(good_data_path + patch + '/' + queue + '/' + region + '/') :
        i += 1
        if i % 1000 == 0 :
            print(i)
        # ensure it's a .json file
        if not(match_id.endswith('.json')) :
            continue

        file_name = good_data_path + patch + '/' + queue + '/' + region + '/' + match_id
        f = open(file_name)
        # every file should start with a dictionary and the key 'matchId'
        # if not, transfer it to the bad data folder
        if not(f.readline().startswith('{"matchId":')) :
            print(region + '/' + match_id)
            file_dest = bad_data_path + patch + '/' + queue + '/' + region + '/' + match_id
            shutil.move(file_name, file_dest)
            failures = failures + 1
        f.close()

print(str(failures) + ' failures removed!')