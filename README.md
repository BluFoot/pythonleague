# Patch Comparer – 5.11 vs 5.14
by Jeremie van der Sande

I started this project with the goal of analyzing the effect of the AP item changes introduced in patch 5.12. However, we ended up spending much more time than originally planned and now we have this! The website presents champion and item statistics for the patches 5.11 and 5.14. 

###Features:
* View playrates and winrates for champions and items.
* Filter champions by role, both in the icon box and on the table.
* Filter champions by role.
* Filter items by category.
* Filter champions/items by name through searchbars.
* View most popular and highest winrate items for a champion, vice versa for items.
* Browse through beautiful champion splashes by pressing "Next splash" while browing a champion's page.
* Switch between normal/ranked at any point!

###Notes
* I recommend Firefox or Chrome, but all modern browsers are compatible.
* A large display gives the optimal experience, but mobile phones can get every bit of information!
* For champion's items by winrate, only items with >2% playrate are shown. Same for items' champions.
* Keep in mind that the item statistics are for people who have the item at the end of the game. So certain items like Mejai's have a high winrate not because they allow the game to be won, but because they are usually purchased after the game is already likely to be won.
* Similarly, champions or items with extremely low playrates may have high winrates even though they are not exceptionally powerful.
* Devourer statistics are messed up because of Sated.

### How the process works:
curler.py downloads the match details. analyzer.py analyzes them into raw_data.json. champ_data_init.py, item_data_init.py and data_organizer.py organizes raw_data.json into data files in the web/data folder. 
