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
}

function disable_submit(form_id) {
    $(form_id + '-submit').prop('disabled', true);
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

// -- user register --
$(document).ready(function(){
    let form_id = '#offcanvas-user-register';
    enable_toggle(form_id);
    $('#offcanvas-user-register-submit').click(function(){
        hide_errors(form_id);
        disable_submit(form_id);
        let user_login = $('#offcanvas-user-register-user-login').val();
        let user_pass = $('#offcanvas-user-register-user-pass').val();
        let user_name = $('#offcanvas-user-register-user-name').val();

        $.ajax({
            method: 'POST',
            url: APP_URL + 'user/?user_login=' + user_login + '&user_name=' + user_name + '&user_pass=' + user_pass,
            dataType: 'json',
            success: function(data) {
                if(APP_DEBUG) {console.log(data);}
                if($.isEmptyObject(data.errors)) {
                    hide_form(form_id);
                    clear_form(form_id);
                    enable_submit(form_id);
                } else {
                    show_errors(form_id, data.errors);
                    enable_submit(form_id);
                }
            },
            error: function(xhr, status, error) {
                if(APP_DEBUG) {console.log(error);}
                enable_submit(form_id);
            }
        });
        /*
        .done(function(msg) {
            if(APP_DEBUG) {
                console.log(msg);
            }
            before_submit('offcanvas-user-register');
            if(msg.success == 'true') {
                console.log('done');
                //var user_email = $('#form-user-register-email').val();
                //hideforms();
                //clearforms();
                //$('#form-user-signin').offcanvas('show');
                //$('#form-user-signin-email').val(user_email);
            } else {
                console.log('error');
                // Show error, enable submit & hide spinner
                //$('#form-user-register-error').text(I18N['errors'][msg.error.code]);
                //$('#form-user-register-error').removeClass('d-none');
                //$('#form-user-register-submit').prop('disabled', false);
                //$('#form-user-register-spinner').addClass('d-none');
            }
        */
    });
});
