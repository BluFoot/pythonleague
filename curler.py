from settings import *
import json
import os
import pycurl
import time

def curl_to_file (url, file_name):
    f = open(file_name, 'wb')
    c = pycurl.Curl()
    c.setopt(c.URL, url)
    c.setopt(c.WRITEDATA, f)
    c.perform()
    c.close()
    f.close()

patch = '5.14'
queue = 'normal_5x5'
regions = ['kr', 'lan', 'las', 'na', 'oce', 'ru', 'tr']

for region in regions :
    print('region: ' + region)
    f = open(matchlist_path + patch + '/' + queue + '/' + region + '.json')
    match_list = json.load(f)
    f.close()
    i = 0

    for match_id in match_list :
        i += 1
        if region is 'kr' and i < 393 :
            continue
        if i % 100 == 0 :
            print(i)
        if region is 'br' and i < 4000 :
            print('skip br ' + str(i) + ' ' + str(match_id))
            continue
        if region is 'eune' and i < 6000 :
            print('skip eune ' + str(i) + ' ' + str(match_id))
            continue
        url = 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v2.2/match/' + str(match_id) + '?api_key=09ee29a8-ab3d-462f-9851-d194e1811e33'
        file_name = good_data_path + patch + '/' + queue + '/' + region + '/' + str(match_id) + '.json'
        print(file_name)
        curl_to_file(url, file_name)

        time.sleep(1.2)