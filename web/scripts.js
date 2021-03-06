function get_mini_data() {
    $.getJSON('data/mini_champ_data.json', function(jd) {
        champs = jd;
        files_opened++;
        if (files_opened == 2) mini_data_ready();
    });
    $.getJSON('data/mini_item_data.json', function(jd) {
        items = jd;
        files_opened++;
        if (files_opened == 2) mini_data_ready();
    });
}

function mini_data_ready() {
    $(document).ready(function() {
        $("#ranked_solo").prop('checked', 'true');
        $("#champ").prop('checked', 'true');
        $(".all_filter").prop('checked', 'true');
        get_all_data();
        post_icons();
        post_tables();
    });
}

function get_all_data() {
    files_opened = 0;
    $.getJSON("get.php", {FILE:"data/champ_data.json"},function(data) {
      champs = data;
      files_opened++;
      if (files_opened == 3) all_data_ready();
    },"JSON");
    $.post("get.php", {FILE:"data/item_data.json"},function(data) {
      items = data;
      files_opened++;
      if (files_opened == 3) all_data_ready();
    },"JSON");
    $.getJSON('data/item_tags.json', function(jd) {
        riot_item_groups = jd;
        files_opened++;
        if (files_opened == 3) all_data_ready();
    });
}

function all_data_ready() {
    refresh_data();
    $("#queue_choice input").change(function() {
        cur_queue = $(this).attr('id');
        /* WIP
        $("#league_choice").toggle();
        */
        refresh_data();
    });

    // species choice
    $("#species_choice input").change(function() {
        cur_species = $(this).attr('id');
        refresh_data();
    });

    // icon clicks
    $("#champ_icons input").change(function() {
        refresh_data();
    });
    $("#item_icons input").change(function() {
        refresh_data();
    });

    // data icon clicks
    $("#data_wrapper").on('click', '.data_icon.champ_icon', function() {
        key = $(this).attr('data-key');
        if (!$("#all_item_icons").is(':checked') && !$("#all_champ_icons").is(':checked')) {
            $("#all_item_icons").prop('checked', 'true');
        }
        $("#"+key).prop('checked', 'true');
        refresh_data();
    });
    $("#data_wrapper").on('click', '.data_icon.item_icon', function() {
        key = $(this).attr('data-key');
        if (!$("#all_champ_icons").is(':checked') && !$("#all_item_icons").is(':checked')) {
            $("#all_champ_icons").prop('checked', 'true');
        }
        $("#"+key).prop('checked', 'true'); 
        refresh_data();
    });

    // post more data
    $("#champ_more_button").click(function() {
        post_more_champ_data();
    });
    $("#item_more_button").click(function() {
        post_more_item_data();
    });

    // searchbars
    $("#champ_search").on('input', function() {
        filter_champs(false);
    });
    $("#item_search").on('input', function() {
        filter_items(false);
    });

    // filters
    $("#champ_filters input").change(function() {
        if (cur_species == 'item') {
            $("#champ").prop('checked', 'true');
            cur_species = 'champ';
            refresh_data();
        }
        filter_champs(false);
    });
    $(".item_filters input").change(function() {
        if (cur_species == 'champ') {
            $("#item").prop('checked', 'true');
            cur_species = 'item';
            refresh_data();
        }
        filter_items(false);
    });

    // splash button
    $("#next_splash").click(function() {
        next_splash();
    });
}

function post_icons() {
    var txt1, txt2, bg;
    var key;
    txt1 = "<input type = 'radio' name = 'champ_icons' id = 'all_champ_icons' checked>";
    txt2 = "<label for = 'all_champ_icons' class = 'icon button_icon champ_icon all_icon'>All</label>";
    $("#champ_icons").append(txt1, txt2);
    for (key in champs) {
        name = champs[key].name;
        txt1 = "<input type = 'radio' name = 'champ_icons' id = '" + key + "'>";
        txt2 = '<label for ="' + key + '" title = "' + name + '" class = "icon button_icon champ_icon"></label>';
        txt3 = "url(" + dragon_champ + key + ".png)";
        $("#champ_icons").append(txt1, txt2);
        $("label[for='" + key + "']").css('background-image', txt3);
    }
    txt1 = "<input type = 'radio' name = 'item_icons' id = 'all_item_icons' checked>";
    txt2 = "<label for = 'all_item_icons' class = 'icon button_icon item_icon all_icon'>All</label>";
    $("#item_icons").append(txt1, txt2);
    for (key in items) {
        name = items[key].name;
        txt1 = "<input type = 'radio' name = 'item_icons' id = '" + key + "'>";
        txt2 = '<label for ="' + key + '" title = "' + name + '" class = "icon button_icon item_icon"></label>';
        txt3 = 'url(' + dragon_item + key + '.png)';
        $("#item_icons").append(txt1, txt2);
        $("#item_icons > label[for='" + key + "']").css('background-image', txt3);
    }
}

function Champ(key, queue) {
    this.key = key;
    this.name = champs[key].name;
    this.icon = '<img data-key = "' + key + '" title = "' + this.name + '" class="icon champ_icon data_icon" src="' + dragon_champ + key + '.png">';
    this.playrate1 = champs[key].stats['5.11'][queue].playrate + '%';
    this.playrate2 = champs[key].stats['5.14'][queue].playrate + '%';
    this.winrate1 = champs[key].stats['5.11'][queue].winrate + '%';
    this.winrate2 = champs[key].stats['5.14'][queue].winrate + '%';
    this.winrate_diff = champs[key].stats['5.14'][queue].winrate_diff + '%';
}

function Item(key, queue) {
    this.key = key;
    this.name = items[key].name;
    this.icon = '<img data-key = "' + key + '" title = "' + this.name + '" class="icon item_icon data_icon" src="' + dragon_item + key + '.png">';
    this.playrate1 = items[key].stats['5.11'][queue].playrate + '%';
    this.playrate2 = items[key].stats['5.14'][queue].playrate + '%';
    this.winrate1 = items[key].stats['5.11'][queue].winrate + '%';
    this.winrate2 = items[key].stats['5.14'][queue].winrate + '%';
    this.winrate_diff = items[key].stats['5.14'][queue].winrate_diff + '%';
}  

function post_tables() {
    var data;
    var height = $(window).height() - 250;
    $("table").show();
    for (var i = queues.length - 1; i >= 0; i--) {
        data = [];
        j = 0;
        for (var champ_key in champs) {
            data[j] = new Champ(champ_key, queues[i]);
            j++;
        }
        $("#" + queues[i] + "_champ_data").DataTable({
            searching: false,
            paging: false,
            scrollY: height,
            data: data,
            columns: [
                {data: 'name'}, 
                {data: 'icon'}, 
                {data: 'playrate1'},
                {data: 'playrate2'}, 
                {data: 'winrate1'},
                {data: 'winrate2'},
                {data: 'winrate_diff'}
            ],
            createdRow: function( row, data, dataIndex ) {
                $(row).addClass('champ_row');
                $(row).attr('data-key', data.key);
                winrate_diff = parseInt(data.winrate_diff.slice(0, - 1));
                if (winrate_diff > 0) {
                    $('td', row).eq(6).css('color', 'green');
                }
                else if (winrate_diff < 0) {
                    $('td', row).eq(6).css('color', 'red');
                }
            }
        });
    }

    for (i = queues.length - 1; i >= 0; i--) {
        data = [];
        j = 0;
        for (var item_key in items) {
            data[j] = new Item(item_key, queues[i]);
            j++;
        }
        $("#" + queues[i] + "_item_data").DataTable({
            searching: false,
            paging: false,
            scrollY: height,
            data: data,
            columns: [
                {data: 'name'}, 
                {data: 'icon'}, 
                {data: 'playrate1'},
                {data: 'playrate2'}, 
                {data: 'winrate1'},
                {data: 'winrate2'},
                {data: 'winrate_diff'}
            ],
            createdRow: function( row, data, dataIndex ) {
                $(row).addClass('item_row');
                $(row).attr('data-key', data.key);
                winrate_diff = parseInt(data.winrate_diff.slice(0, - 1));
                if (winrate_diff > 0) {
                    $('td', row).eq(6).css('color', 'green');
                }
                else if (winrate_diff < 0) {
                    $('td', row).eq(6).css('color', 'red');
                }
            }
        }); 
    }
    $(".dataTables_scrollHeadInner").css('width', '100%');
    $("table").css('width', '100%');
    $(".data_page").hide();
    $(".dataTables_wrapper").hide();
    $("#" + cur_queue + "_" + cur_species + "_data_wrapper").show();
    $("#overall_data").show();
}

function filter_champs(refresh) {
    var text = $('#champ_search').val();
    var filter_tag = $("#champ_filters input:checked").attr('id');
    if (refresh && !text && tag === false) {
        return;
    }
    $('.champ_icon').show();
    $('.champ_row').show();
    if (filter_tag == 'all_champ_tags') {
        $('.button_icon.champ_icon').filter(function() {
            var key = $(this).attr('for');
            if (key === 'all_champ_icons') return false;
            var name = champs[key].name;
            return !(name.match(RegExp(text, "gi")));
        }).hide();
        $('.champ_row').filter(function() {
            var key = $(this).attr('data-key');
            if (key === 'all_champ_icons') return false;
            var name = champs[key].name;
            return !(name.match(RegExp(text, "gi")));
        }).hide();
    } else {
        $('.button_icon.champ_icon').filter(function() {
            var key = $(this).attr('for');
            if (key === 'all_champ_icons') return false;
            var name = champs[key].name;
            var tags = champs[key].tags;
            var tags_match = $.inArray(filter_tag, tags) > -1;
            return !(name.match(RegExp(text, "gi")) && tags_match);
        }).hide();
        $('.champ_row').filter(function() {
            var key = $(this).attr('data-key');
            if (key === 'all_champ_icons') return false;
            var name = champs[key].name;
            var tags = champs[key].tags;
            var tags_match = $.inArray(filter_tag, tags) > -1;
            return !(name.match(RegExp(text, "gi")) && tags_match);
        }).hide();
    }
}

function filter_items(refresh) {
    var text = $('#item_search').val();
    var filter_group = $("#item_group_filters input:checked").attr('id');
    $(".item_tag_filters").hide();
    $('.item_icon').show();
    $('.item_row').show();

    if (refresh && !text && filter_group == 'all_item_groups') {
        return;
    }

    if (filter_group == 'all_item_groups') {
        $('.button_icon.item_icon').filter(function() {
            var key = $(this).attr('for');
            if (key === 'all_item_icons') return false;
            var name = items[key].name;
            return !(name.match(RegExp(text, "gi")));
        }).hide();
        $('.item_row').filter(function() {
            var key = $(this).attr('data-key');
            if (key === 'all_item_icons') return false;
            var name = items[key].name;
            return !(name.match(RegExp(text, "gi")));
        }).hide();
    } 

    else {
        $("#" + filter_group + "_filters").show();
        var filter_tag = $("#" + filter_group + "_filters input:checked").attr('id');
        var filter_tags = [];
        if (filter_tag == "all_" + filter_group) {
            for (var i = riot_item_groups[filter_group].length - 1; i >= 0; i--) {
                filter_tags.push(riot_item_groups[filter_group][i].toLowerCase());
            }
        }
        else {
            filter_tags = [filter_tag.toLowerCase()];
        }
        $('.button_icon.item_icon').filter(function() {
            var key = $(this).attr('for');
            if (key === 'all_item_icons') return false;
            var name = items[key].name;
            var tags = items[key].tags;
            // convert to lower case
            for (var i = tags.length - 1; i >= 0; i--) {
                tags[i] = tags[i].toLowerCase();
            }
            // check tags match
            var tags_match = false;
            for (i = tags.length - 1; i >= 0; i--) {
                tags_match = tags_match || ($.inArray(tags[i], filter_tags) > -1);
            }
            // check regex too
            return !(name.match(RegExp(text, "gi")) && tags_match);
        }).hide();
        $('.item_row').filter(function() {
            var key = $(this).attr('data-key');
            if (key === 'all_item_icons') return false;
            var name = items[key].name;
            var tags = items[key].tags;
            // convert to lower case
            for (var i = tags.length - 1; i >= 0; i--) {
                tags[i] = tags[i].toLowerCase();
            }
            // check tags match
            var tags_match = false;
            for (i = tags.length - 1; i >= 0; i--) {
                tags_match = tags_match || ($.inArray(tags[i], filter_tags) > -1);
            }
            // check regex too
            return !(name.match(RegExp(text, "gi")) && tags_match);
        }).hide();
    }
}

function refresh_data() {
    log(cur_species)
    $(".data_page").hide();
    $(".dataTables_wrapper").hide();
    $("#data_title").empty();
    champ_key = $("#champ_icons input:checked").attr('id');
    item_key = $("#item_icons input:checked").attr('id');
    if (champ_key == 'all_champ_icons' && item_key == 'all_item_icons') {
        post_overall_data();
    } else if (item_key == 'all_item_icons') {
        post_champ_data(champ_key);
    } else if (champ_key == 'all_champ_icons') {
        post_item_data(item_key);
    } else {
        post_combo_data(champ_key, item_key);
    }
}

function post_overall_data() {
    $("#data_title").text(nice_queue[cur_queue] + ' ' + cur_species + ' stats');
    $("#" + cur_queue + "_" + cur_species + "_data_wrapper").show();
    $("#overall_data").show();
}

function post_champ_data(key) {
    $("#data_title").text('LOADING DATA...');
    $('<img/>').attr('src', dragon_splash + key + '_0.jpg').load(function() {
       $(this).remove(); // prevent memory leaks as @benweet suggested
       $("#champ_combo_data").css('background-image', 'url(' + dragon_splash + key + '_0.jpg)');
       var name = champs[key].name;
       $("#data_title").text(name);
    });
    $("#champ_combo_data").attr('data-skin', 0);

    var txt0, txt1, txt2, top, top_length;
    for (i = patches.length - 1; i >= 0; i--) {
        patch = patches[i];
        for (j = categories.length - 1; j >= 0; j--) {
            $("#champ_change" + i + j).text(champs[key].stats[patch][cur_queue][categories[j]] + '%');
            $("#champ_top" + i + j + " .top_img").empty();
            top = champs[key].items[patch][cur_queue]["top_" + categories[j]];
            top_length =     top.length;
            for (k = 0; k < 10 && k < top_length; k++) {
                name = items[top[k]].name;
                rate = champs[key].items[patch][cur_queue][top[k]][categories[j]] + '%';
                txt0 = '<figure class = "imgtxt">';
                txt1 = '<img data-key="'+top[k]+'" src="'+dragon_item+top[k]+'.png" title="'+name+'" class="icon item_icon data_icon">';
                txt2 = '<figcaption>' + rate + '</figcaption><figurediv>';
                $("#champ_top" + i + j + " .top_img").append(txt0+txt1+txt2);
            }
        }
    }
    patch = patches[1];
    top = champs[key].items[patch][cur_queue].top_winrate_diff;
    top_length = top.length;
    $("#champ_top12 .top_img").empty();
    for (k = 0; k < 10 && k < top_length; k++) {
        name = items[top[k]].name;
        rate = champs[key].items[patch][cur_queue][top[k]].winrate_diff + '%';
        txt0 = '<figure class = "imgtxt">';
        txt1 = '<img data-key="'+top[k]+'" src="'+dragon_item+top[k]+'.png" title="'+name+'" class="icon item_icon data_icon">';
        txt2 = '<figcaption>' + rate + '</figcaption><figurediv>';
        $("#champ_top12 .top_img").append(txt0+txt1+txt2);
    }

    $("#data_title").text('LOADING IMAGE...');
    $("#champ_more").show();
    $("#champ_combo_data").show();
    $("#champ_data").show();
}

function post_more_champ_data() {
    $("#champ_more").hide();
    var txt0, txt1, txt2, top, top_length;
    var key = $("#champ_icons input:checked").attr('id');
    for (i = patches.length - 1; i >= 0; i--) {
        patch = patches[i];
        for (j = categories.length - 1; j >= 0; j--) {
            top = champs[key].items[patch][cur_queue]["top_" + categories[j]];
            top_length = top.length;
            for (k = 10; k < 20 && k < top_length; k++) {
                name = items[top[k]].name;
                rate = champs[key].items[patch][cur_queue][top[k]][categories[j]] + '%';
                txt0 = '<figure class = "imgtxt">';
                txt1 = '<img data-key="'+top[k]+'" src="'+dragon_item+top[k]+'.png" title="'+name+'" class="icon item_icon data_icon">';
                txt2 = '<figcaption>' + rate + '</figcaption><figurediv>';
                $("#champ_top" + i + j + " .top_img").append(txt0+txt1+txt2);
            }
        }
    }
    patch = patches[1];
    top = champs[key].items[patch][cur_queue].top_winrate_diff;
    top_length = top.length;
    for (k = 10; k < 20 && k < top_length; k++) {
        name = items[top[k]].name;
        rate = champs[key].items[patch][cur_queue][top[k]].winrate_diff + '%';
        txt0 = '<figure class = "imgtxt">';
        txt1 = '<img data-key="'+top[k]+'" src="'+dragon_item+top[k]+'.png" title="'+name+'" class="icon item_icon data_icon">';
        txt2 = '<figcaption>' + rate + '</figcaption><figurediv>';
        $("#champ_top12 .top_img").append(txt0+txt1+txt2);
    }
}

function post_item_data(key) {
    $("#item_data").css({
        'background-size': '150%',
        'background-position': 'default'
    });
    $("#item_more").show();
    var txt0, txt1, txt2, top, top_length;
    var name = items[key].name;
    $("#data_title").text(name);
    $("#item_img").css('background-image', 'url(' + dragon_item + key + '.png)');
    $("#item_img").attr('data-key', key);

    for (i = patches.length - 1; i >= 0; i--) {
        patch = patches[i];
        for (j = categories.length - 1; j >= 0; j--) {
            $("#item_change" + i + j).text(items[key].stats[patch][cur_queue][categories[j]] + '%');
            $("#item_top" + i + j + " .top_img").empty();
            top = items[key].champs[patch][cur_queue]["top_" + categories[j]];
            top_length = top.length;
            for (k = 0; k < 10 && k < top_length; k++) {
                name = champs[top[k]].name;
                rate = items[key].champs[patch][cur_queue][top[k]][categories[j]] + '%';
                txt0 = '<figure class = "imgtxt">';
                txt1 = '<img data-key="'+top[k]+'" src="'+dragon_champ+top[k]+'.png" title="'+name+'" class="icon champ_icon data_icon">';
                txt2 = '<figcaption>' + rate + '</figcaption><figurediv>';
                $("#item_top" + i + j + " .top_img").append(txt0+txt1+txt2);
            }
        }
    }

    patch = patches[1];
    top = items[key].champs[patch][cur_queue].top_winrate_diff;
    top_length = top.length;
    $("#item_top12 .top_img").empty();
    for (k = 0; k < 10 && k < top_length; k++) {
        name = champs[top[k]].name;
        rate = items[key].champs[patch][cur_queue][top[k]].winrate_diff + '%';
        txt0 = '<figure class = "imgtxt">';
        txt1 = '<img data-key="'+top[k]+'" src="'+dragon_champ+top[k]+'.png" title="'+name+'" class="icon champ_icon data_icon">';
        txt2 = '<figcaption>' + rate + '</figcaption><figurediv>';
        $("#item_top12 .top_img").append(txt0+txt1+txt2);
    }
    $("#item_data").show();
}

function post_more_item_data() {
    $("#item_data").css({
        'background-size': '230%',
        'background-position': '30% 30%'
    });
    $("#item_more").hide();
    var txt0, txt1, txt2, top, top_length;
    var key = $("#item_icons input:checked").attr('id');
    for (i = patches.length - 1; i >= 0; i--) {
        patch = patches[i];
        for (j = categories.length - 1; j >= 0; j--) {
            top = items[key].champs[patch][cur_queue]["top_" + categories[j]];
            top_length = top.length;
            for (k = 10; k < 20 && k < top_length; k++) {
                name = champs[top[k]].name;
                rate = items[key].champs[patch][cur_queue][top[k]][categories[j]] + '%';
                txt0 = '<figure class = "imgtxt">';
                txt1 = '<img data-key="'+top[k]+'" src="'+dragon_champ+top[k]+'.png" title="'+name+'" class="icon champ_icon data_icon">';
                txt2 = '<figcaption>' + rate + '</figcaption><figurediv>';
                $("#item_top" + i + j + " .top_img").append(txt0+txt1+txt2);
            }
        }
    }
    patch = patches[1];
    top = items[key].champs[patch][cur_queue].top_winrate_diff;
    top_length = top.length;
    for (k = 10; k < 20 && k < top_length; k++) {
        name = champs[top[k]].name;
        rate = items[key].champs[patch][cur_queue][top[k]].winrate_diff + '%';
        txt0 = '<figure class = "imgtxt">';
        txt1 = '<img data-key="'+top[k]+'" src="'+dragon_champ+top[k]+'.png" title="'+name+'" class="icon champ_icon data_icon">';
        txt2 = '<figcaption>' + rate + '</figcaption><figurediv>';
        $("#item_top12 .top_img").append(txt0+txt1+txt2);
    }
}

function post_combo_data(champ_key, item_key) {
    $("#data_title").text('LOADING...');
    var cur_champ_key = $("#champ_icons input:checked").attr('id');
    if (cur_champ_key != champ_key) {
        $('<img/>').attr('src', dragon_splash + champ_key + '_0.jpg').load(function() {
           $(this).remove(); // prevent memory leaks as @benweet suggested
           $("#champ_combo_data").css('background-image', 'url(' + dragon_splash + champ_key + '_0.jpg)');
        }); 
    }

    var champ_name = champs[champ_key].name;
    var item_name = items[item_key].name;
    $("#data_title").text(champ_name + ' with ' + item_name);
    $("#combo_champ_img").css('background-image', 'url(' + dragon_champ + champ_key + '.png)');
    $("#combo_item_img").css('background-image', 'url(' + dragon_item + item_key + '.png)');

    for (i = patches.length - 1; i >= 0; i--) {
        patch = patches[i];
        for (j = categories.length - 1; j >= 0; j--) {
            try {
                rate = champs[champ_key].items[patch][cur_queue][item_key][categories[j]]+'%';
                $("#combo_change"+i+j).text(rate);
            }
            catch(TypeError) {
                $("#combo_change"+i+j).text('no games played');
            }
        }
    }
    $("#champ_combo_data").show();
    $("#combo_data").show();
}

function next_splash() {
    var key = $("#champ_icons input:checked").attr('id');
    var skin_id = parseInt($("#champ_combo_data").attr('data-skin'));
    var skins = champs[key].skins;
    skin_id = (skin_id + 1) % skins;
    $("#champ_combo_data").attr('data-skin', skin_id);
    $('<img/>').attr('src', dragon_splash + key + '_' + skin_id + '.jpg').load(function() {
       $(this).remove(); // prevent memory leaks as @benweet suggested
       $("#champ_combo_data").css('background-image', 'url(' + dragon_splash + key + '_' + skin_id + '.jpg)');
       $("#champ_combo_data").show();
    });
}

var log = console.log.bind(console);

var files_opened = 0;
var champs;
var items;
var matches_analyzed;
var riot_champ_tags = ['Assassin', 'Fighter', 'Mage', 'Marksman', 'Support', 'Tank'];
var riot_item_groups;
var patch, patches = ['5.11', '5.14'];
var cur_queue = 'ranked_solo', queues = ['normal_5x5', 'ranked_solo'];
var nice_queue = {'normal_5x5': 'Normal', 'ranked_solo': 'Ranked'};
var cur_species = 'champ';
var categories = ['playrate', 'winrate'];
var dragon = 'http://ddragon.leagueoflegends.com/cdn/';
var dragon_patch = '5.16.1/';
var dragon_item = dragon + dragon_patch + 'img/item/';
var dragon_champ = dragon + dragon_patch + 'img/champion/';
var dragon_splash = 'splash/';
var i, j;

get_mini_data();