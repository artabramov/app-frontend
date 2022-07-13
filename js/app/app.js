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

// current translation
let I18N = {};

// self user
//let USER_TOKEN = $.cookie('user-token') ? $.cookie('user-token'): '';
let USER_TOKEN = 'eyJ1c2VyX2lkIjogMiwgInRva2VuX3NpZ25hdHVyZSI6ICJwQ0Yyb0dYdkdPU0tvaTNkamVhSTd2MzRaM1p6Mkh6bVY4TVlLNmRyVFEzN0FKdVhXRG9YMGxFV1JpRkJiRFpXb3ZHdTJMRGxmeWNKWkZiWXp3d1E4TFpxSHcza2JTV0JEUDUyM0xTNjdGRE1IYUk0ZEU4bGxqVUVKamt4b0o2UiIsICJ0b2tlbl9leHBpcmVzIjogMTY1ODM0NzQ2OC45MTYzNDU0fQ==';
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

        $('#offcanvas-user-update-user-summary').text(user_data.user_summary);
        if(USER_DATA.meta.image_link) {
            $('#offcanvas-user-update-user-image').prop('src', USER_DATA.meta.image_link);
            $('#offcanvas-user-update-user-image').removeClass('d-none');
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
}

// show tab posts
function show_posts(volume_id=0, post_status='', post_title='', post_tag='', offset=0) {
    hide_tabs();
    enable_links();
    $('#tab-posts').removeClass('d-none');
    posts_list(volume_id, post_status, post_title, post_tag, offset);
}

// show tab comments
function show_comments(post_id, offset=0) {
    hide_tabs();
    enable_links();
    $('#tab-comments').removeClass('d-none');
    comments_list(post_id, offset);
}

// ---- update post status switch ----
function update_post_status(id, volume_id, post_status) {
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
        $(id + '-draft').on('click', function() {posts_list(volume_id, 'draft', '', '', 0)});
        $(id + '-todo').off('click');
        $(id + '-todo').on('click', function() {posts_list(volume_id, 'todo', '', '', 0)});
        $(id + '-doing').off('click');
        $(id + '-doing').on('click', function() {posts_list(volume_id, 'doing', '', '', 0)});
        $(id + '-done').off('click');
        $(id + '-done').on('click', function() {posts_list(volume_id, 'done', '', '', 0)});
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

// ---- events ----
$(document).ready(function(){
    // start page
    $('#tab-outer').removeClass('d-none');

    // user auth
    if(!$.isEmptyObject(USER_TOKEN)) {
        user_auth();
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

    // volume insert
    $('#offcanvas-volume-insert-submit').click(function(){
        let volume_title = $('#offcanvas-volume-insert-volume-title').val();
        let volume_summary = $('#offcanvas-volume-insert-volume-summary').val();
        let volume_currency = $('#offcanvas-volume-insert-volume-currency').val();
        volume_insert(volume_title, volume_summary, volume_currency);
    });

    // category insert
    $('#offcanvas-category-insert-submit').click(function(){
        let category_title = $('#offcanvas-category-insert-category-title').val();
        let category_summary = $('#offcanvas-category-insert-category-summary').val();
        category_insert(category_title, category_summary);
    });

    // show offcanvas post insert
    $('#offcanvas-post-insert').on('show.bs.offcanvas', function () {
        volumes_dropdown('#offcanvas-post-insert-volume-id');
        categories_dropdown('#offcanvas-post-insert-category-id');
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

    // comment insert
    $('#offcanvas-comment-insert-submit').click(function(){
        let comment_content = $('#offcanvas-comment-insert-comment-content').val();
        comment_insert(POST_ID, comment_content);
    });

    // show tab users
    $('#navbar-users').click(function(){
        hide_tabs();
        enable_links();
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

});
