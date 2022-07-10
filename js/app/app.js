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
let USER_TOKEN = 'eyJ1c2VyX2lkIjogMSwgInRva2VuX3NpZ25hdHVyZSI6ICJtZE9kMHM4S0hyS1Z1SVBINFBIZHVUdmEzYWhuVFJkRFNWQXFEaW92cmdLMldDUE9YYTllTVVudWVBbnNUSjlXUjRKNkt0ek94R2YwNjNOZWZhNFR0RlZBZ3NZVjNNa1p0QlRqdWlNeHpZRzkwbWp0bFgwVUhIMzE4Vndtc1loMyIsICJ0b2tlbl9leHBpcmVzIjogMTY1Nzk2NTA0OS45NjM5NDN9';
let USER_DATA = {};

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
    $('#tab-users').addClass('d-none');
    $('#tab-volumes').addClass('d-none');
    $('#tab-categories').addClass('d-none');
    $('#tab-posts').addClass('d-none');
    //$('#tab-comments').addClass('d-none');
    $('#tab-reports').addClass('d-none');

    $('#tab-outer').addClass('d-none');
    $('#tab-help').addClass('d-none');
}

function show_posts(volume_id=0, post_status='', post_title='', post_tag='', offset=0) {
    hide_tabs();
    enable_links();
    $('#tab-posts').removeClass('d-none');
    posts_list(volume_id, post_status, post_title, post_tag, offset);
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

    //volumes_dropdown('asfdsafd');
    $('#offcanvas-post-insert').on('show.bs.offcanvas', function () {
        //console.log('show');
        volumes_dropdown('#offcanvas-post-insert-volume-id');
    })

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

});

// ---- GO! ----

$(document).ready(function(){
    //SELF_USER = new User();
});



