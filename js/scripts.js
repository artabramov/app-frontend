// -- app --
const APP_URL = 'http://localhost/app/';

// -- user token & user --
let USER_TOKEN = "eyJ1c2VyX2lkIjogNzIsICJ0b2tlbl9zaWduYXR1cmUiOiAiNHRHdEdYZ2QxZG5yQUZZN3YwMmsyN05ONXlmSjlOek9lcFR4cHVjOGRkczFoNlo0WWVuS0hScU5GZ3gyNzhmc2lhSTdCRndjZmNnMjN2cTVIdXl5SHBMdUhLd2NDdkY2eWhNM0EwN29XaEtDdmtaSXZRQ2pqWGFHdDVYREtibEEiLCAidG9rZW5fZXhwaXJlcyI6IDE2NTc3MjgxNDIuMzI3OTY1N30=";
//let USER_TOKEN = !$.cookie('user-token') ? '' : $.cookie('user-token');
console.log(USER_TOKEN);
let USER = {};

let POSTS_LIMIT = 2;
let POSTS_OFFSET = 0;
let POSTS_STATUS = 'done';
let POSTS_VOLUME_ID = 0;

// -- i18n --
$(document).ready(function(){
    $.each(I18N, function(key, value){
        if(!I18N_IGNORE.includes(key)){
            $.each(I18N[key], function(k, v){
                $('#' + key + '-' + k).html(v);
            });
        }
    });
    $('#navbar-search-input').attr('placeholder', I18N['navbar-search-input']);
});

// -- navbar --
function hide_navbar() {
    $('#navbar-users').addClass('d-none');
    $('#navbar-volumes').addClass('d-none');
    $('#navbar-categories').addClass('d-none');
    $('#navbar-reports').addClass('d-none');
    $('#navbar-search-input').addClass('d-none');
    $('#navbar-search-submit').addClass('d-none');

    $('#navbar-register').removeClass('d-none');
    $('#navbar-signin').removeClass('d-none');

    $('#navbar-user').addClass('d-none');
    $('#navbar-user-name').text('');
    //$('#navbar-user-select').attr('data-user-id', '0');

    $('#offcanvas-user-self-user-name').text('');
    $('#offcanvas-user-self-user-login').text('');
    $('#offcanvas-user-self-user-summary').text('');

    $('#offcanvas-user-update-user-name').val('');
    $('#offcanvas-user-update-user-summary').text('');
    $('#offcanvas-user-update-image').addClass('d-none');
    $('#offcanvas-user-update-image-img').prop('src', '');
}

function show_navbar() {
    $('#navbar-users').removeClass('d-none');
    $('#navbar-volumes').removeClass('d-none');
    $('#navbar-categories').removeClass('d-none');
    $('#navbar-reports').removeClass('d-none');
    $('#navbar-search-input').removeClass('d-none');
    $('#navbar-search-submit').removeClass('d-none');

    $('#navbar-register').addClass('d-none');
    $('#navbar-signin').addClass('d-none');

    $('#navbar-user-name').text(USER.user_name);
    //$('#navbar-user-select').attr('data-user-id', USER.id);
    $('#navbar-user').removeClass('d-none');

    $('#offcanvas-user-self-user-name').text(USER.user_name);
    $('#offcanvas-user-self-user-login').text(USER.user_login);

    $('#offcanvas-user-update-user-name').val(USER.user_name);
    
    if(USER.meta.user_summary) {
        $('#offcanvas-user-self-user-summary-label').removeClass('d-none');
        $('#offcanvas-user-self-user-summary').text(USER.meta.user_summary);
        $('#offcanvas-user-update-user-summary').text(USER.meta.user_summary);
    } else {
        $('#offcanvas-user-self-user-summary-label').addClass('d-none');
        $('#offcanvas-user-self-user-summary').text('');
        $('#offcanvas-user-update-user-summary').text('');
    }

    if(USER.meta.image_link) {
        $('#offcanvas-user-self-image-img').prop('src', USER.meta.image_link);
        $('#offcanvas-user-self-image-label').removeClass('d-none');
        $('#offcanvas-user-self-image').removeClass('d-none');
        $('#offcanvas-user-update-image-img').prop('src', USER.meta.image_link);
        $('#offcanvas-user-update-image').removeClass('d-none');
    } else {
        $('#offcanvas-user-self-image-label').addClass('d-none');
        $('#offcanvas-user-self-image').addClass('d-none');
        $('#offcanvas-user-self-image-img').prop('src', '');
        $('#offcanvas-user-update-image').addClass('d-none');
        $('#offcanvas-user-update-image-img').prop('src', '');
    }
}

function update_navbar() {
    console.log(USER_TOKEN);
    if(USER_TOKEN) {
        let user_data = JSON.parse(atob(USER_TOKEN));
        
        $.ajax({
            method: 'GET',
            headers: {'User-Token': USER_TOKEN},
            url: APP_URL + 'user/' + user_data.user_id + '/',
            dataType: 'json',
            success: function(msg) {
                if($.isEmptyObject(msg.errors)) {
                    USER = msg.data.user;
                    show_navbar();
                } else {
                    hide_navbar();       
                }
            },
            error: function(xhr, status, error) {
                hide_navbar();
            }
        });
    } else {
        hide_navbar();
    }
}

$(document).ready(function() {
    update_navbar();
});

// -- pagination --

function pagination(id, func, offset, rows_on_page, rows_count) {

    // pages
    pages_count = Math.ceil( rows_count / rows_on_page );
    page_active = Math.floor( offset / rows_on_page );
    page_start = page_active > 1 ? page_active - 2 : 0;
    page_end = page_active > pages_count - 3 ? pages_count - 1 : page_active + 2;

    // show pagination
    if( pages_count > 1 ) {
        $('#' + id).removeClass('d-none');
        $('#' + id).addClass('d-inline');
    }

    // prev
    disabled = page_active == 0 ? ' disabled' : '';
    $('#' + id).find('ul').append('<li class="page-item' + disabled + '"><a class="page-link" href="#" onClick="eval(\'' + func + '\')(' + ((page_active - 1) * rows_on_page) + ');">Prev</a></li>');

    // pages
    for( i = page_start; i<=page_end; i++ ) {
        active = i == page_active ? ' active' : '';
        $('#' + id).find('ul').append('<li class="page-item' + active + '"><a class="page-link" href="#" onClick="eval(\'' + func + '\')(' + (i * rows_on_page) + ');">' + i + '</a></li>');
    }

    // next
    disabled = page_active == page_end ? ' disabled' : '';
    $('#' + id).find('ul').append('<li class="page-item' + disabled + '"><a class="page-link" href="#" onClick="eval(\'' + func + '\')(' + ((page_active + 1) * rows_on_page) + ');">Next</a></li>');

}

// -- navbar tabs --
function hide_tabs() {
    $('#tab-users').addClass('d-none');
    $('#tab-volumes').addClass('d-none');
    $('#tab-categories').addClass('d-none');
    $('#tab-reports').addClass('d-none');
    $('#tab-posts').addClass('d-none');
    $('#tab-comments').addClass('d-none');
}

function update_volumes(offset) {
    let volumes_limit = 2;

    $('#tab-volumes-table').find('tbody').text('');
    $('#tab-volumes-pagination').find('ul').text('');

    $.ajax({
        type: 'GET',
        headers: {'User-Token': USER_TOKEN},
        url: APP_URL + 'volumes/' + offset + '/',
        dataType: 'json',
        cache: false,
        processData: false, 
        contentType: false,
        success: function(msg) {
            console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                msg.data.volumes.forEach(function(volume) {
                    console.log(volume);

                    $('#tab-volumes-table').find('tbody').append(
                        '<tr>' +
                        '<th scope="row">' + volume.id + '</th>' +
                        '<td>' + volume.created + '</td>' +
                        '<td><a href="#" onclick="show_tab_posts(' + volume.id + ');">' + volume.volume_title + '</a></td>' +
                        '<td>' + volume.volume_currency + '</td>' +
                        '<td>' + volume.volume_sum + '</td>' +
                        '</tr>'
                    );
                });
                
                pagination('tab-volumes-pagination', 'update_volumes', offset, volumes_limit, msg.data.volumes_count);

            };
        }
    });
}

$(document).ready(function() {
    $('#navbar-users').click(function(){
        hide_tabs();
        $('#tab-users').removeClass('d-none');
    });

    $('#navbar-volumes').click(function(){
        hide_tabs();
        $('#tab-volumes').removeClass('d-none');
        update_volumes(0);
    });

    $('#navbar-categories').click(function(){
        hide_tabs();
        $('#tab-categories').removeClass('d-none');
    });

    $('#navbar-reports').click(function(){
        hide_tabs();
        $('#tab-reports').removeClass('d-none');
    });
});


// -- POSTS --
$(document).ready(function(){
    $('#tab-posts-group-statuses :button').click(function(){
        console.log($(this).attr('data-post-status'));
        POSTS_STATUS = $(this).attr('data-post-status');
        update_tab_posts_group_statuses();
    });
});

function update_tab_posts_group_statuses() {
    let buttons = $('#tab-posts-group-statuses :button');
    buttons.each(function(value) {
        if($(this).attr('data-post-status') == POSTS_STATUS) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });
}

function show_tab_posts(volume_id) {
    hide_tabs();
    $('#tab-posts').removeClass('d-none');
    //$('#tab-posts-title').text(volume_title);
    POSTS_STATUS = 'done';
    POSTS_VOLUME_ID = volume_id
    POSTS_OFFSET = 0;
    update_table_posts(POSTS_OFFSET);
    update_tab_posts_group_statuses();
}

function update_table_posts(offset) {
    $('#tab-posts-table').find('tbody').text('');
    $('#tab-posts-pagination').find('ul').text('');

    POSTS_OFFSET = offset;

    $.ajax({
        type: 'GET',
        headers: {'User-Token': USER_TOKEN},
        url: APP_URL + 'posts/' + POSTS_OFFSET + '/?volume_id=' + POSTS_VOLUME_ID + '&post_status=' + POSTS_STATUS,
        dataType: 'json',
        cache: false,
        processData: false, 
        contentType: false,
        success: function(msg) {
            console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                msg.data.posts.forEach(function(post) {
                    console.log(post);

                    $('#tab-posts-table').find('tbody').append(
                        '<tr>' +
                        '<th scope="row">' + post.id + '</th>' +
                        '<td>' + post.created + '</td>' +
                        '<td><a href="#">' + post.post_title + '</a></td>' +
                        '<td>' + post.post_sum + '</td>' +
                        '</tr>'
                    );
                });
                
                pagination('tab-posts-pagination', 'update_table_posts', POSTS_OFFSET, POSTS_LIMIT, msg.data.posts_count);

            };
        }
    });
}


// -- form --
function enable_toggle(form_id) {
    $(form_id + '-check').click(function(){
        if ($(form_id + '-check').prop('checked')) {
            $(form_id + '-submit').prop('disabled', false);
        } else {
            $(form_id + '-submit').prop('disabled', true);
        }
    });
}

function enable_submit(form_id) {
    $(form_id + '-submit').prop('disabled', false);
    $(form_id + '-spinner').addClass('d-none');
}

function disable_submit(form_id) {
    $(form_id + '-submit').prop('disabled', true);
    $(form_id + '-spinner').removeClass('d-none');
}

function show_errors(form_id, errors) {
    for(let key in errors) {
        let error = errors[key];
        let id = form_id + '-' + key.replace('_', '-') + '-error';
        $(id).text(translate_error(error));
        $(id).removeClass('d-none');
    }
}

function hide_errors(form_id) {
    let form_inputs = $(form_id + ' :input');
    form_inputs.each(function(value) {
        let id = '#' + $(this).attr('id') + '-error';
        $(id).removeClass('d-none');
        $(id).text('');
    });
}

function translate_error(error) {
    let result = '';
    for(let key in error) {
        result += error[key] in I18N['errors'] ? I18N['errors'][error[key]] : error[key];
        result += ' ';
    }
    return result;
}

function clear_form(form_id) {
    let form_inputs = $(form_id + ' :input');
    form_inputs.each(function(value) {
        let id = '#' + $(this).attr('id');
        $(id).val('');
    });
}

function hide_form(form_id) {
    $(form_id).offcanvas('hide');    
}

function show_form(form_id) {
    $(form_id).offcanvas('show');
}

// -- user register --
$(document).ready(function(){
    let form_id = '#offcanvas-user-register';

    enable_toggle(form_id);
    $(form_id + '-submit').click(function(){
        let user_login = $(form_id + '-user-login').val();
        let user_pass = $(form_id + '-user-pass').val();
        let user_name = $(form_id + '-user-name').val();

        hide_errors(form_id);
        disable_submit(form_id);
        $.ajax({
            method: 'POST',
            url: APP_URL + 'user/?user_login=' + user_login + '&user_name=' + user_name + '&user_pass=' + user_pass,
            dataType: 'json',
            success: function(msg) {

                if($.isEmptyObject(msg.errors)) {
                    hide_form(form_id);

                    $(form_id + '-after-totp-image').attr('src', msg.data.totp_qrcode);
                    $(form_id + '-after-totp-key').text(msg.data.totp_key);
                    show_form(form_id + '-after');

                    clear_form(form_id);
                    enable_submit(form_id);

                } else {
                    show_errors(form_id, msg.errors);
                    enable_submit(form_id);
                }
            },
            error: function(xhr, status, error) {
                enable_submit(form_id);
            }
        });
    });
});

// -- user signin --
$(document).ready(function(){
    let form_id = '#offcanvas-user-signin';

    $(form_id + '-submit').click(function(){
        let user_login = $(form_id + '-user-login').val();
        let user_totp = $(form_id + '-user-totp').val();

        disable_submit(form_id);
        hide_errors(form_id);
        $.ajax({
            method: 'GET',
            url: APP_URL + 'token/?user_login=' + user_login + '&user_totp=' + user_totp,
            dataType: 'json',
            success: function(msg) {

                if($.isEmptyObject(msg.errors)) {
                    hide_form(form_id);
                    clear_form(form_id);
                    enable_submit(form_id);

                    USER_TOKEN = msg.data.user_token;
                    $.cookie('user-token', USER_TOKEN);
                    update_navbar();

                } else {
                    show_errors(form_id, msg.errors);
                    enable_submit(form_id);
                }
            },
            error: function(xhr, status, error) {
                enable_submit(form_id);
            }
        });
    });
});

// -- user signout --
$(document).ready(function(){
    $('#navbar-user-signout').click(function(){
        $.ajax({
            method: 'PUT',
            headers: {'User-Token': USER_TOKEN},
            url: APP_URL + 'token/',
            dataType: 'json',
            success: function(msg) {
            }
        });

        $.cookie('user-token', '', { expires: -1 });
        USER_TOKEN = '';
        USER = {};
        update_navbar();
    });
});

// -- user signin > user restore --
$(document).ready(function(){
    $('#offcanvas-user-signin-restore').click(function(){
        hide_form('#offcanvas-user-signin');
        show_form('#offcanvas-user-restore');
    });
});

// -- user restore --
$(document).ready(function(){
    let form_id = '#offcanvas-user-restore';

    $(form_id + '-submit').click(function(){
        let user_login = $(form_id + '-user-login').val();
        let user_pass = $(form_id + '-user-pass').val();

        disable_submit(form_id);
        hide_errors(form_id);
        $.ajax({
            method: 'GET',
            url: APP_URL + 'pass/?user_login=' + user_login + '&user_pass=' + user_pass,
            dataType: 'json',
            success: function(msg) {

                if($.isEmptyObject(msg.errors)) {
                    hide_form(form_id);
                    show_form(form_id + '-after');

                    clear_form(form_id);
                    enable_submit(form_id);

                } else {
                    show_errors(form_id, msg.errors);
                    enable_submit(form_id);
                }
            },
            error: function(xhr, status, error) {
                enable_submit(form_id);
            }
        });
    });
});

// -- user select --
$(document).ready(function(){
    let form_id = '#offcanvas-user-select'
    $('#navbar-user-select').click(function(){
        //show_form(form_id);
        //console.log($(this).data('user-id'));
        let user_id = $(this).data('user-id');

        $.ajax({
            method: 'GET',
            headers: {'User-Token': USER_TOKEN},
            url: APP_URL + 'user/' + user_id + '/',
            dataType: 'json',
            success: function(msg) {

                if($.isEmptyObject(msg.errors)) {
                    $(form_id + '-user-name').text(msg.data.user.user_name);
                    show_form(form_id);
                }
            }
        });


    });
});

// -- upload user image --
$(document).ready(function(){
    let form_id = '#offcanvas-user-update'
    $(form_id + "-image-input").change(function(){
        let user_file = $(form_id + '-image-input')[0].files[0];

        if(!$.isEmptyObject(user_file)) {
            var formData = new FormData();
            formData.append('user_file', user_file);

            $.ajax({
                type: 'POST',
                headers: {'User-Token': USER_TOKEN},
                url: APP_URL + 'image/',
                data: formData,
                dataType: 'json',
                cache: false,
                processData: false, 
                contentType: false,
                success: function(msg) {
                    update_navbar();
                }
            });
        }

    });
});

// -- user update --
$(document).ready(function(){
    let form_id = '#offcanvas-user-update';

    $(form_id + '-submit').click(function(){
        let user_name = $(form_id + '-user-name').val();
        let user_summary = $(form_id + '-user-summary').val();

        disable_submit(form_id);
        hide_errors(form_id);
        $.ajax({
            method: 'PUT',
            headers: {'User-Token': USER_TOKEN},
            url: APP_URL + 'user/' + USER.id + '/?user_name=' + user_name + '&user_summary=' + user_summary,
            dataType: 'json',
            success: function(msg) {
                console.log(msg);

                if($.isEmptyObject(msg.errors)) {
                    hide_form(form_id);
                    clear_form(form_id);
                    enable_submit(form_id);

                    update_navbar();
                    show_form('#offcanvas-user-self');

                } else {
                    show_errors(form_id, msg.errors);
                    enable_submit(form_id);
                }
            },
            error: function(xhr, status, error) {
                enable_submit(form_id);
            }
        });
    });
});

// -- user repass --
$(document).ready(function(){
    let form_id = '#offcanvas-user-repass';

    $(form_id + '-submit').click(function(){
        let user_pass = $(form_id + '-user-pass').val();
        let user_repass = $(form_id + '-user-repass').val();

        disable_submit(form_id);
        hide_errors(form_id);
        $.ajax({
            method: 'PUT',
            headers: {'User-Token': USER_TOKEN},
            url: APP_URL + 'pass/?user_pass=' + user_pass + '&user_repass=' + user_repass,
            dataType: 'json',
            success: function(msg) {
                console.log(msg);

                if($.isEmptyObject(msg.errors)) {
                    hide_form(form_id);
                    clear_form(form_id);
                    enable_submit(form_id);
                    show_form(form_id + '-after');

                } else {
                    show_errors(form_id, msg.errors);
                    enable_submit(form_id);
                }
            },
            error: function(xhr, status, error) {
                enable_submit(form_id);
            }
        });
    });
});

// -- temp --
$(document).ready(function(){
    $('#navbar-token').click(function(){
        console.log(USER);
    });
});

