const APP_URL = 'http://localhost/app/';
//const APP_URL = 'http://localhost:5000/';

// -- user --
//let USER_TOKEN = 'eyJ1c2VyX2lkIjogNzIsICJ1c2VyX25hbWUiOiAiQXJ0ZW0gQWJyYW1vdiIsICJ1c2VyX3N0YXR1cyI6ICJhZG1pbiIsICJ0b2tlbl9zaWduYXR1cmUiOiAidTJtY2swYnJaU3ZXams5V3R1NFNGdmUxMTBoOUM3N05zVHpvcG5xWmJ0SDAxUUdSM2lRZkp4UE9OeWgwMHQwazY0THdhWUQ1MVRrSmJadTVGTlhUT29PRXVtakJBQ2FOM2QzTm11M2tzVTRKY1JWeHU5bXZlT09UbWFuQkxHRG4iLCAidG9rZW5fZXhwaXJlcyI6IDE2NTc0NTM0ODMuNjczMzcxNn0=';
let USER_TOKEN = !$.cookie('user-token') ? '' : $.cookie('user-token');
let USER_DATA = !USER_TOKEN ? {} : JSON.parse(atob(USER_TOKEN));
console.log(USER_TOKEN);

// -- update navbar on onload --
$(document).ready(function(){
    update_navbar();
});

// -- i18n --
$(document).ready(function(){
    $.each(I18N, function(key, value) {
        if(!I18N_IGNORE.includes(key)) {
            $.each(I18N[key], function(k, v) {
                $('#' + key + '-' + k).html(v);
            });
        }
    });
    $('#navbar-search-input').attr('placeholder', I18N['navbar-search-input']);
});

// -- navbar --
function update_navbar() {
    if($.isEmptyObject(USER_DATA)) {
        $('#navbar-users').addClass('d-none');
        $('#navbar-volumes').addClass('d-none');
        $('#navbar-categories').addClass('d-none');
        $('#navbar-search-input').addClass('d-none');
        $('#navbar-search-submit').addClass('d-none');
        $('#navbar-register').removeClass('d-none');
        $('#navbar-signin').removeClass('d-none');
        $('#navbar-user-name').text('');
        $('#navbar-user').addClass('d-none');
    } else {
        $('#navbar-users').removeClass('d-none');
        $('#navbar-volumes').removeClass('d-none');
        $('#navbar-categories').removeClass('d-none');
        $('#navbar-search-input').removeClass('d-none');
        $('#navbar-search-submit').removeClass('d-none');
        $('#navbar-register').addClass('d-none');
        $('#navbar-signin').addClass('d-none');
        $('#navbar-user-name').text(USER_DATA.user_name);
        $('#navbar-user').removeClass('d-none');
    }
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
                console.log(msg);

                if($.isEmptyObject(msg.errors)) {
                    hide_form(form_id);
                    clear_form(form_id);
                    enable_submit(form_id);

                    $(form_id + '-after-totp-image').attr('src', msg.data.totp_qrcode);
                    $(form_id + '-after-totp-key').text(msg.data.totp_key);
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
                console.log(msg);

                if($.isEmptyObject(msg.errors)) {
                    hide_form(form_id);
                    clear_form(form_id);
                    enable_submit(form_id);

                    USER_TOKEN = msg.data.user_token;
                    USER_DATA = JSON.parse(atob(USER_TOKEN));
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
            headers: {
                'user_token': USER_TOKEN,
            },
            url: APP_URL + 'token/',
            dataType: 'json',
            success: function(msg) {
                console.log(msg);

                if($.isEmptyObject(msg.errors)) {
                    $.cookie('user-token', '', { expires: -1 });
                    USER_TOKEN = '';
                    USER_DATA = {};
                    update_navbar();
                }
            }
        });
    });
});

// -- user restore --
$(document).ready(function(){
    $('#offcanvas-user-signin-user-restore').click(function(){
        hide_form('#offcanvas-user-signin');
        show_form('#offcanvas-user-restore');
    });
});

// -- temp --
$(document).ready(function(){
    $('#navbar-temp').click(function(){
        console.log(USER_DATA);
    });
});

