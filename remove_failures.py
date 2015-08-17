from settings import *
import json
import os
import shutil

failures = 0

for patch in patches :
    print('patch: ' + patch)
    for queue in queues :
        print('queue: ' + queue)
        for region in regions :
            print('region: ' + region)
            for match_id in os.listdir(good_data_path + patch + '/' + queue + '/' + region + '/') :
                # ensure it's a .json file
                if not(match_id.endswith('.json')) :
                    continue

                file_name = good_data_path + patch + '/' + queue + '/' + region + '/' + match_id
                f = open(file_name)
                # every file should start with a dictionary and they key 'matchId'
                # if not, transfer it to the bad data folder
                if not(f.readline().startswith('{"matchId":')) :
                    file_dest = bad_data_path + patch + '/' + queue + '/' + region + '/' + match_id
                    shutil.move(file_name, file_dest)
                    failures = failures + 1
                f.close()

print(str(failures) + ' failures removed!')