import pprint

patches = ['5.11', '5.14']
queues = ['normal_5x5', 'ranked_solo']
regions = ['br', 'eune', 'euw', 'kr', 'lan', 'las', 'na', 'oce', 'ru', 'tr']
project_path = '/Users/alex/Documents/league_api_challenge/'
matchlist_path = project_path + 'AP_ITEM_DATASET/'
good_data_path = project_path + 'data/good/'
bad_data_path = project_path + 'data/bad/'

pp = pprint.PrettyPrinter(indent = 4)