const APP_URL = 'http://localhost/app/';
const APP_DEBUG = true;

// -- i18n --
$(document).ready(function(){
    $.each(I18N, function(key, value) {
        if(!I18N_IGNORE.includes(key)) {
            $.each(I18N[key], function(k, v) {
                //console.log('#' + key + '-' + k);
                $('#' + key + '-' + k).text(v);
            });
        }
    });
    $('#navbar-search-input').attr('placeholder', I18N['navbar-search-input']);
});

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
    $('#offcanvas-user-register-submit').click(function(){
        hide_errors(form_id);
        disable_submit(form_id);

        let user_login = $(form_id + '-user-login').val();
        let user_pass = $(form_id + '-user-pass').val();
        let user_name = $(form_id + '-user-name').val();

        $.ajax({
            method: 'POST',
            url: APP_URL + 'user/?user_login=' + user_login + '&user_name=' + user_name + '&user_pass=' + user_pass,
            dataType: 'json',
            success: function(msg) {
                if(APP_DEBUG) {console.log(msg);}
                if($.isEmptyObject(msg.errors)) {
                    hide_form(form_id);
                    clear_form(form_id);
                    enable_submit(form_id);

                    $('#offcanvas-user-register-done-totp-image').attr('src', msg.data.totp_qrcode);
                    $('#offcanvas-user-register-done-totp-key').text(msg.data.totp_key);
                    show_form(form_id + '-done');
                } else {
                    show_errors(form_id, msg.errors);
                    enable_submit(form_id);
                }
            },
            error: function(xhr, status, error) {
                if(APP_DEBUG) {console.log(error);}
                enable_submit(form_id);
            }
        });
    });
});


