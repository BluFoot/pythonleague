from settings import *
import os
import pycurl
import time
import sys

def curl_to_file (url, file_name):
    f = open(file_name, 'wb')
    c = pycurl.Curl()
    c.setopt(c.URL, url)
    c.setopt(c.WRITEDATA, f)
    try : 
        c.perform()
    except pycurl.error :
        print("ERROR WITH PYCURL")
    c.close()
    f.close()

try :
    patch = sys.argv[1]
    queue = sys.argv[2]
except IndexError :
    print('usage : curler.py <patch> <queue>')
    sys.exit(2)

if not(patch in patches) or not(queue in queues) :
    print('incorrect patch or queue')
    sys.exit(2)

for region in regions :
    f = open(matchlist_path + patch + '/' + queue + '/' + region + '.json')
    match_list = json.load(f)
    f.close()
    i = 0

    for match_id in match_list :
        i += 1
        
        print(region + '/' + str(match_id))
        if i % 100 == 0 :
            print(i)

        url = 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v2.2/match/' + str(match_id) + '?api_key=09ee29a8-ab3d-462f-9851-d194e1811e33'
        file_name = good_data_path + patch + '/' + queue + '/' + region + '/' + str(match_id) + '.json'
        curl_to_file(url, file_name)

        time.sleep(1.2)