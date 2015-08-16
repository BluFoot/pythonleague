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

regions = ['br', 'eune', 'euw', 'kr', 'lan', 'las', 'na', 'oce', 'ru', 'tr']

for region in regions :
    print('REGION: ' + region)
    f = open('/Users/alex/Documents/programming/AP_ITEM_DATASET/5.14/normal_5x5/' + region + '.json')
    match_list = json.load(f)
    i = 0

    for match_id in match_list :
        url = 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v2.2/match/' + str(match_id) + '?api_key=09ee29a8-ab3d-462f-9851-d194e1811e33'
        file_name = '/Users/alex/Documents/programming/data/5.14/normal_5x5/' + region + '/' + str(match_id) + '.json'
        curl_to_file(url, file_name)

        i = i + 1
        if i % 100 == 0 :
            print(i)

        time.sleep(1.2)