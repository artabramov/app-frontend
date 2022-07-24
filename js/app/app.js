// backend address
const APP_URL = 'http://localhost/app/';

// available languages UI
const LANGUAGES = {
    'en': 'english',
    'ru': 'русский',
    'es': 'español',
};

// current locale
let LOCALE = $.cookie('user-lang') ? $.cookie('user-locale') : 'en';
const TIMEZONE = 'Europe/Moscow';

// current translation
let I18N = {};

// regular refresh
let INTERVAL_FUNC;
let INTERVAL_TIME = 10000; // 10 seconds 

// self user
//let USER_TOKEN = $.cookie('user-token') ? $.cookie('user-token'): '';
let USER_TOKEN = "eyJ1c2VyX2lkIjogMSwgInRva2VuX3NpZ25hdHVyZSI6ICIyVjgzQXRhN1pUYTBITmQ0NDFaY3JJT3ZIUWZMZG1Pam1GcXp2MTQ2dll1NlhuMmpvNTBaYlFHSWNJYzJLb21scTFzQUZHTkRYT0ZiM0FTcVZwVndhM1hSb2lOZXdsUE1UYjB5T3lmTWxZbHp1TExYNDd5SG5Lc0cwdWl0T0twRyIsICJ0b2tlbl9leHBpcmVzIjogMTY1OTI1MDY5NC4yMTc3NzQyfQ==";
let USER_DATA = {};

// rows limit on page
const ROWS_LIMIT = 2;

// current entities
let VOLUME_ID;
let POST_ID;

// ---- app core ----

function show_offcanvas(offcanvas_id) {
    $(offcanvas_id).offcanvas('show');
}

function hide_offcanvas(offcanvas_id) {
    $(offcanvas_id).offcanvas('hide');
}

function clear_inputs(offcanvas_id) {
    let inputs = $(offcanvas_id + ' :input[type=text], textarea');
    inputs.each(function(value) {
        let id = '#' + $(this).attr('id');
        $(id).val('');
    });
}

function enable_submit(offcanvas_id) {
    $(offcanvas_id + '-submit').prop('disabled', false);
    $(offcanvas_id + '-spinner').addClass('d-none');
}

function disable_submit(offcanvas_id) {
    $(offcanvas_id + '-submit').prop('disabled', true);
    $(offcanvas_id + '-spinner').removeClass('d-none');
}

function click_switch(offcanvas_id) {

}

function show_errors(offcanvas_id, errors) {
    for(let key in errors) {
        let error = errors[key];
        let id = offcanvas_id + '-' + key.replace('_', '-');

        $(id).addClass('is-invalid');
        $(id + '-error').text(translate_error(error));
        $(id + '-error').removeClass('d-none');
    }
}

function hide_errors(offcanvas_id) {
    let inputs = $(offcanvas_id + ' :input');
    inputs.each(function(value) {
        let id = '#' + $(this).attr('id');

        $(id).removeClass('is-invalid');
        $(id + '-error').removeClass('d-none');
        $(id + '-error').text('');
    });
}

function translate_error(error_elements) {
    let result = '';
    for(let key in error_elements) {
        if (LOCALE == 'en') {
            result += error_elements[key];
        } else {
            result += error_elements[key] in I18N['_errors'] ? I18N['_errors'][error_elements[key]] : error_elements[key];
        }
        result += ' ';
    }
    return result;
}

function update_navbar(user_data) {
    if(!$.isEmptyObject(USER_DATA)) {
        $('#navbar-users').removeClass('d-none');
        $('#navbar-volumes').removeClass('d-none');
        $('#navbar-categories').removeClass('d-none');
        $('#navbar-reports').removeClass('d-none');
        $('#navbar-add').removeClass('d-none');
        $('#navbar-search').removeClass('d-none');
        
        $('#navbar-i18n').removeClass('d-none');
        $('#navbar-user-login').text(user_data.user_login);
        $('#navbar-user').removeClass('d-none');
        
        $('#navbar-register').addClass('d-none');
        $('#navbar-signin').addClass('d-none');

        $('#offcanvas-user-update-user-login').text(user_data.user_login);
        $('#offcanvas-user-update-user-status').text(user_data.user_status);
        $('#offcanvas-user-update-user-summary').text(user_data.user_summary);
        if(USER_DATA.meta.image_link) {
            $('#offcanvas-user-update-user-image').prop('src', USER_DATA.meta.image_link);
            $('#offcanvas-user-update-user-image').removeClass('d-none');
        } else {
            $('#offcanvas-user-update-user-image').prop('src', '');
            $('#offcanvas-user-update-user-image').addClass('d-none');
        }

    } else {
        $('#navbar-users').addClass('d-none');
        $('#navbar-volumes').addClass('d-none');
        $('#navbar-categories').addClass('d-none');
        $('#navbar-reports').addClass('d-none');
        $('#navbar-add').addClass('d-none');
        $('#navbar-search').addClass('d-none');

        $('#navbar-i18n').removeClass('d-none');
        $('#navbar-user-login').text('');
        $('#navbar-user').addClass('d-none');

        $('#navbar-register').removeClass('d-none');
        $('#navbar-signin').removeClass('d-none');

        $('#offcanvas-user-update-user-login').text('');
        $('#offcanvas-user-update-user-status').text('');
        $('#offcanvas-user-update-user-summary').text('');
        $('#offcanvas-user-update-user-image').prop('src', '');
        $('#offcanvas-user-update-user-image').addClass('d-none');
    }
}

function enable_links() {
    $('#navbar-users').find('a').removeClass('disabled');
    $('#navbar-volumes').find('a').removeClass('disabled');
    $('#navbar-categories').find('a').removeClass('disabled');
    $('#navbar-reports').find('a').removeClass('disabled');
}

function hide_tabs() {
    VOLUME_ID = 0;
    $('#tab-users').addClass('d-none');
    $('#tab-volumes').addClass('d-none');
    $('#tab-categories').addClass('d-none');
    $('#tab-posts').addClass('d-none');
    $('#tab-comments').addClass('d-none');
    $('#tab-reports').addClass('d-none');
    $('#tab-outer').addClass('d-none');
    $('#tab-help').addClass('d-none');
    $('#tab-terms').addClass('d-none');
}

// show tab posts
function show_posts(volume_id=0, post_status='', post_title='', post_tag='', offset=0, volume_title='') {
    hide_tabs();
    enable_links();
    $('#tab-posts').removeClass('d-none');
    posts_list(volume_id, post_status, post_title, post_tag, offset, volume_title);
}

// show tab comments
function show_comments(post_id, offset=0) {
    hide_tabs();
    enable_links();
    $('#tab-comments').removeClass('d-none');
    comments_list(post_id, offset);
}

// show tab users
function show_tab_users(offset=0) {
    users_list(offset);
}

// ---- update post status switch ----
function update_post_status(id, volume_id, post_status, volume_title) {
        $(id).removeClass('d-none');
        $(id + '-draft').removeClass('active');
        $(id + '-todo').removeClass('active');
        $(id + '-doing').removeClass('active');
        $(id + '-done').removeClass('active');
        
        if(post_status == 'draft') {
            $(id + '-draft').addClass('active');
        
        } else if(post_status == 'todo') {
            $(id + '-todo').addClass('active');
        
        } else if(post_status == 'doing') {
            $(id + '-doing').addClass('active');
        
        } else if(post_status == 'done') {
            $(id + '-done').addClass('active');
        }
        
        $(id + '-draft').off('click');
        $(id + '-draft').on('click', function() {posts_list(volume_id, 'draft', '', '', 0, volume_title)});
        $(id + '-todo').off('click');
        $(id + '-todo').on('click', function() {posts_list(volume_id, 'todo', '', '', 0, volume_title)});
        $(id + '-doing').off('click');
        $(id + '-doing').on('click', function() {posts_list(volume_id, 'doing', '', '', 0, volume_title)});
        $(id + '-done').off('click');
        $(id + '-done').on('click', function() {posts_list(volume_id, 'done', '', '', 0, volume_title)});
}

// ---- pagination ----
function pagination(id, func, args, offset, rows_count, rows_limit) {
    let args_str = '';
    args.forEach(function(arg) {
        args_str += "'" + arg + "', ";
    });

    // pages
    pages_count = Math.ceil( rows_count / rows_limit );
    page_active = Math.floor( offset / rows_limit );
    page_start = page_active > 1 ? page_active - 2 : 0;
    page_end = page_active > pages_count - 3 ? pages_count - 1 : page_active + 2;

    // show pagination
    if( pages_count > 1 ) {
        $('#' + id).removeClass('d-none');
        $('#' + id).addClass('d-inline');

        // prev
        disabled = page_active == 0 ? ' disabled' : '';
        $('#' + id).find('ul').append('<li class="page-item' + disabled + '"><a class="page-link" href="#" onClick="eval(\'' + func + '\')(' + args_str + ((page_active - 1) * rows_limit) + ');">Prev</a></li>');

        // pages
        for( i = page_start; i<=page_end; i++ ) {
            active = i == page_active ? ' active' : '';
            $('#' + id).find('ul').append('<li class="page-item' + active + '"><a class="page-link" href="#" onClick="eval(\'' + func + '\')(' + args_str + (i * rows_limit) + ');">' + i + '</a></li>');
        }

        // next
        disabled = page_active == page_end ? ' disabled' : '';
        $('#' + id).find('ul').append('<li class="page-item' + disabled + '"><a class="page-link" href="#" onClick="eval(\'' + func + '\')(' + args_str + ((page_active + 1) * rows_limit) + ');">Next</a></li>');
    }
}

// ---- make tags list ----
function tags_list(tags) {
    let tags_str = '';
    tags.forEach(function(tag) {
        if(tags_str != '') {
            tags_str += ', ';
        }
        tags_str += '<a href="#" onclick="show_posts(0, \'\', \'\', \'' + tag + '\', 0);">' + tag + '</a>';
    });
    return tags_str;
}

// ---- make tags string ----
function tags_string(tags) {
    let tags_str = '';
    tags.forEach(function(tag) {
        if(tags_str != '') {
            tags_str += ', ';
        }
        tags_str += tag;
    });
    return tags_str;
}

// hide title on tab posts
function hide_tab_posts_title() {
    $('#tab-posts-title-by-volume').addClass('d-none');
    $('#tab-posts-title-by-title').addClass('d-none');
    $('#tab-posts-title-by-tag').addClass('d-none');
    $('#tab-posts-title-object').addClass('d-none');
}

function show_offcanvas_user_select(user_id) {
    user_select(user_id);    
    show_offcanvas('#offcanvas-user-select');
}

function show_offcanvas_volume_update(volume_id) {
    //console.log('fuck');
    fill_offcanvas_volume_update(volume_id);
    show_offcanvas('#offcanvas-volume-update');
}

function volume_update(volume_id, volume_title, volume_summary, volume_currency) {
    //console.log(volume_summary);
    volume_update(volume_id, volume_title, volume_summary, volume_currency);
}

function show_offcanvas_post_update(post_id) {
    //console.log(post_id);
    fill_offcanvas_post_update(post_id);
    show_offcanvas('#offcanvas-post-update');
}

function show_offcanvas_user_status(user_id) {
    $('#offcanvas-user-status-user-id').val(user_id);
    //$('#offcanvas-user-status-user-login').text(user_login);
    user_status(user_id);
    show_offcanvas('#offcanvas-user-status');
    //console.log(user_id);
}

function show_offcanvas_category_update(category_id) {
    fill_offcanvas_category_update(category_id);
    show_offcanvas('#offcanvas-category-update');
    //console.log(category_id);
}

function show_offcanvas_category_delete(category_id) {
    //console.log(category_id);
    $('#offcanvas-category-delete-category-id').val(category_id);
    show_offcanvas('#offcanvas-category-delete');   
}


// regular refresh (not used)
function refresh_tab(func, args) {
    clearInterval(INTERVAL_FUNC);
    INTERVAL_FUNC = setInterval(function() {
        //console.log(func + '(' + args + ')')
        eval(func + '(' + args + ')')
    }, INTERVAL_TIME);
}

// show actions
function show_actions(actions_id) {
    $(actions_id).removeClass('d-none');
}

// hide actions
function hide_actions(actions_id) {
    $(actions_id).addClass('d-none');
}


/**
 * Format bytes as human-readable text.
 * 
 * @param bytes Number of bytes.
 * @param dp Number of decimal places to display.
 * 
 * @return Formatted string.
 */
 function filesize(bytes, sizes) {

    const thresh=1024;
    const dp=1;

    if(bytes == 0) {
        return '0';

    } else if (Math.abs(bytes) < thresh) {
        return bytes + ' ' + sizes[0];
    }

    let u = 0;
    const r = 10**dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < sizes.length - 1);

    return bytes.toFixed(dp) + ' ' + sizes[u];
}

function datetime(datetime) {

    var currentDate = new Date();
    var currentDay = currentDate.getUTCDate();
    var currentMonth = currentDate.getUTCMonth() + 1; //months from 1-12
    var currentYear = currentDate.getUTCFullYear();
    
    //var dt = new Date(datetime + '.000+00:00');
    var dt = new Date(datetime * 1000);
    var dt2 = dt.toLocaleString('en-GB', { timeZone: TIMEZONE })
    var match = dt2.match(/([0-9]+)/g);
  
    var localDay = parseInt(match[0]);
    var localMonth = parseInt(match[1]);
    var localYear = parseInt(match[2]);
    var localHours = parseInt(match[3]);
    var localMinutes = parseInt(match[4]);
  
    if(localYear == currentYear && localMonth == currentMonth && localDay == currentDay) {
      return I18N['_today'] + ' ' + ('0' + localHours).slice(-2) + ':' + ('0' + localMinutes).slice(-2);
  
    } else if(localYear == currentYear) {
      return localDay + ' ' + I18N['_months'][localMonth] + ', ' + ('0' + localHours).slice(-2) + ':' + ('0' + localMinutes).slice(-2);
  
    } else {
      return localDay + ' ' + I18N['_months'][localMonth] + ' ' + localYear + ', ' + ('0' + localHours).slice(-2) + ':' + ('0' + localMinutes).slice(-2);
    }
  
  }

// ---- events ----
$(document).ready(function(){
    //refresh_tab('temp', '"A"');

    // start page
    $('#tab-outer').removeClass('d-none');

    // user auth
    //if(!$.isEmptyObject(USER_TOKEN)) {
    if(USER_TOKEN != '') {
        user_auth();
    } else {
        update_navbar();
    }

    // user register
    $('#offcanvas-user-register-submit').click(function(){
        let user_login = $('#offcanvas-user-register-user-login').val();
        let user_pass = $('#offcanvas-user-register-user-pass').val();
        user_register(user_login, user_pass);
    });

    // user signin
    $('#offcanvas-user-signin-submit').click(function(){
        let user_login = $('#offcanvas-user-signin-user-login').val();
        let user_totp = $('#offcanvas-user-signin-user-totp').val();
        user_signin(user_login, user_totp);
    });

    // user signout
    $('#navbar-user-signout').click(function(){
        USER_TOKEN = '';
        USER_DATA = {};
        $.cookie('user-token', '', { expires: -1 });
        update_navbar();
        hide_tabs();
        $('#tab-outer').removeClass('d-none');
    });

    // user update
    $('#offcanvas-user-update-submit').click(function(){
        let user_summary = $('#offcanvas-user-update-user-summary').val();
        user_update(USER_DATA.id, user_summary);
    });

    // user update after
    $('#offcanvas-user-update-after-submit').click(function(){
        hide_offcanvas('#offcanvas-user-update-after');
    });

    // upload user image
    $('#offcanvas-user-update-user-file').change(function(){
        let user_file = $('#offcanvas-user-update-user-file')[0].files[0];
        upload_image(user_file);
    });

    // change pass
    $('#offcanvas-user-pass-submit').click(function(){
        let user_pass = $('#offcanvas-user-pass-user-pass').val();
        let user_repass = $('#offcanvas-user-pass-user-repass').val();
        update_pass(user_pass, user_repass);
    });

    // change pass after
    $('#offcanvas-user-pass-after-submit').click(function(){
        hide_offcanvas('#offcanvas-user-pass-after');
    });

    // update user status
    $('#offcanvas-user-status-submit').click(function(){
        //hide_offcanvas('#offcanvas-user-pass-after');
        let user_id = $('#offcanvas-user-status-user-id').val();
        let user_status = $('input[name="offcanvas-user-status-user-status"]:checked').val();
        update_user_status(user_id, user_status);
    });

    // update user status after
    $('#offcanvas-user-status-after-submit').click(function(){
        hide_offcanvas('#offcanvas-user-status-after');
        users_list();
    });

    // volume insert
    $('#offcanvas-volume-insert-submit').click(function(){
        let volume_title = $('#offcanvas-volume-insert-volume-title').val();
        let volume_summary = $('#offcanvas-volume-insert-volume-summary').val();
        let volume_currency = $('#offcanvas-volume-insert-volume-currency').val();
        volume_insert(volume_title, volume_summary, volume_currency);
    });

    // volume update
    $('#offcanvas-volume-update-submit').click(function(){
        let volume_id = $('#offcanvas-volume-update-volume-id').val();
        let volume_title = $('#offcanvas-volume-update-volume-title').val();
        let volume_summary = $('#offcanvas-volume-update-volume-summary').val();
        let volume_currency = $('#offcanvas-volume-update-volume-currency').val();
        //console.log(volume_summary);
        volume_update(volume_id, volume_title, volume_summary, volume_currency);
    });

    // volume delete
    $('#offcanvas-volume-delete-submit').click(function(){
        //let volume_id = $('#offcanvas-volume-delete-volume-id').val();
        //console.log(VOLUME_ID);
        volume_delete(VOLUME_ID);
    });

    // category delete
    $('#offcanvas-category-delete-submit').click(function(){
        let category_id = $('#offcanvas-category-delete-category-id').val();
        //console.log(VOLUME_ID);
        category_delete(category_id);
    });

    // post delete
    $('#offcanvas-post-delete-submit').click(function(){
        //let volume_id = $('#offcanvas-volume-delete-volume-id').val();
        //console.log(VOLUME_ID);
        post_delete(POST_ID);
    });

    // category insert
    $('#offcanvas-category-insert-submit').click(function(){
        let category_title = $('#offcanvas-category-insert-category-title').val();
        let category_summary = $('#offcanvas-category-insert-category-summary').val();
        category_insert(category_title, category_summary);
    });

    // category update
    $('#offcanvas-category-update-submit').click(function(){
        let category_id = $('#offcanvas-category-update-category-id').val();
        let category_title = $('#offcanvas-category-update-category-title').val();
        let category_summary = $('#offcanvas-category-update-category-summary').val();
        //console.log(category_id, category_title, category_summary);
        category_update(category_id, category_title, category_summary);
    });

    // show offcanvas post insert
    $('#offcanvas-post-insert').on('show.bs.offcanvas', function () {
        volumes_dropdown('#offcanvas-post-insert-volume-id', VOLUME_ID);
        categories_dropdown('#offcanvas-post-insert-category-id');
    })

    // hide offcanvas volume delete
    $('#offcanvas-volume-delete').on('hide.bs.offcanvas', function () {
        if ($('#offcanvas-volume-delete-switch').prop('checked')) {
            $('#offcanvas-volume-delete-switch').prop('checked', false);
            $('#offcanvas-volume-delete-submit').prop('disabled', true);
        }
    })

    // hide offcanvas post delete
    $('#offcanvas-post-delete').on('hide.bs.offcanvas', function () {
        if ($('#offcanvas-post-delete-switch').prop('checked')) {
            $('#offcanvas-post-delete-switch').prop('checked', false);
            $('#offcanvas-post-delete-submit').prop('disabled', true);
        }
    })

    // post insert
    $('#offcanvas-post-insert-submit').click(function(){
        let volume_id = $('#offcanvas-post-insert-volume-id').val();
        let category_id = $('#offcanvas-post-insert-category-id').val();
        let post_status = $('#offcanvas-post-insert-post-status').val();
        let post_title = $('#offcanvas-post-insert-post-title').val();
        let post_content = $('#offcanvas-post-insert-post-content').val();
        let post_sum = $('#offcanvas-post-insert-post-sum').val();
        let post_tags = $('#offcanvas-post-insert-post-tags').val();

        if(!volume_id) {volume_id = 0;}
        if(!category_id) {category_id = 0;}
        post_insert(volume_id, category_id, post_status, post_title, post_content, post_sum, post_tags);
    });

    // update the post
    $('#offcanvas-post-update-submit').click(function(){
        let post_id = $('#offcanvas-post-update-post-id').val();
        let volume_id = $('#offcanvas-post-update-volume-id').val();
        let category_id = $('#offcanvas-post-update-category-id').val();
        let post_status = $('#offcanvas-post-update-post-status').val();
        let post_title = $('#offcanvas-post-update-post-title').val();
        let post_content = $('#offcanvas-post-update-post-content').val();
        let post_sum = $('#offcanvas-post-update-post-sum').val();
        let post_tags = $('#offcanvas-post-update-post-tags').val();

        if(!volume_id) {volume_id = 0;}
        if(!category_id) {category_id = 0;}
        post_update(post_id, volume_id, category_id, post_status, post_title, post_content, post_sum, post_tags);
        //console.log(post_id);
    });

    // comment insert
    $('#offcanvas-comment-insert-submit').click(function(){
        let comment_content = $('#offcanvas-comment-insert-comment-content').val();
        comment_insert(POST_ID, comment_content);
    });

    // uploads insert
    $('#offcanvas-uploads-insert-submit').click(function(){
        let user_files = $('#offcanvas-uploads-insert-user-files')[0].files;
        uploads_insert(POST_ID, user_files);
    });

    // show tab users
    $('#navbar-users').click(function(){
        hide_tabs();
        enable_links();
        show_tab_users(0);
        $('#navbar-users').find('a').addClass('disabled');
        $('#tab-users').removeClass('d-none');
    });

    // show tab volumes
    $('#navbar-volumes').click(function(){
        hide_tabs();
        enable_links();
        volumes_list();
        $('#navbar-volumes').find('a').addClass('disabled');
        $('#tab-volumes').removeClass('d-none');
    });

    // show tab categories
    $('#navbar-categories').click(function(){
        hide_tabs();
        enable_links();
        categories_list();
        $('#navbar-categories').find('a').addClass('disabled');
        $('#tab-categories').removeClass('d-none');
    });

    // show tab reports
    $('#navbar-reports').click(function(){
        hide_tabs();
        enable_links();
        $('#navbar-reports').find('a').addClass('disabled');
        $('#tab-reports').removeClass('d-none');
    });

    // show tab outer
    $('#footer-outer').click(function(){
        hide_tabs();
        enable_links();
        $('#tab-outer').removeClass('d-none');
    });

    // show tab help
    $('#footer-help').click(function(){
        hide_tabs();
        enable_links();
        $('#tab-help').removeClass('d-none');
    });

    // show tab terms
    $('#footer-terms').click(function(){
        hide_tabs();
        enable_links();
        $('#tab-terms').removeClass('d-none');
    });

    // click search by title
    $('#navbar-search-title').click(function(){
        if($('#navbar-search :input').val()) {
            show_posts(0, '', $('#navbar-search :input').val(), '', 0);
            $('#navbar-search :input').val('');
        }
    });

    // click search by tag
    $('#navbar-search-tag').click(function(){
        if($('#navbar-search :input').val()) {
            show_posts(0, '', '', $('#navbar-search :input').val(), 0);
            $('#navbar-search :input').val('');
        }
    });

    // offcanvas volume_delete switch
    $('#offcanvas-volume-delete-switch').on('click', function(){
        if ($('#offcanvas-volume-delete-switch').prop('checked')) {
            $('#offcanvas-volume-delete-submit').prop('disabled', false);
        } else {
            $('#offcanvas-volume-delete-submit').prop('disabled', true);
        }
    });

    // offcanvas category_delete switch
    $('#offcanvas-category-delete-switch').on('click', function(){
        if ($('#offcanvas-category-delete-switch').prop('checked')) {
            $('#offcanvas-category-delete-submit').prop('disabled', false);
        } else {
            $('#offcanvas-category-delete-submit').prop('disabled', true);
        }
    });

    // offcanvas post delete switch
    $('#offcanvas-post-delete-switch').on('click', function(){
        if ($('#offcanvas-post-delete-switch').prop('checked')) {
            $('#offcanvas-post-delete-submit').prop('disabled', false);
        } else {
            $('#offcanvas-post-delete-submit').prop('disabled', true);
        }
    });


});
