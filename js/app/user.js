// ---- user register ----
function user_register(user_login, user_pass) {
    let offcanvas_id = '#offcanvas-user-register';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'POST',
        url: APP_URL + 'user/?user_login=' + user_login + '&user_pass=' + user_pass,
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                hide_offcanvas(offcanvas_id);
                clear_inputs(offcanvas_id);
                enable_submit(offcanvas_id);

                $(offcanvas_id + '-after-totp-image').attr('src', msg.data.totp_qrcode);
                $(offcanvas_id + '-after-totp-key').text(msg.data.totp_key);
                show_offcanvas(offcanvas_id + '-after');

            } else {
                show_errors(offcanvas_id, msg.errors);
                enable_submit(offcanvas_id);
            }
        },
        error: function(xhr, status, error) {
            enable_submit(offcanvas_id);
        }
    });
}

// ---- user signin ----
function user_signin(user_login, user_totp) {
    let offcanvas_id = '#offcanvas-user-signin';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'GET',
        url: APP_URL + 'token/?user_login=' + user_login + '&user_totp=' + user_totp,
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                hide_offcanvas(offcanvas_id);
                clear_inputs(offcanvas_id);
                enable_submit(offcanvas_id);

                USER_TOKEN = msg.data.user_token;
                $.cookie('user-token', USER_TOKEN);
                user_auth();

            } else {
                show_errors(offcanvas_id, msg.errors);
                enable_submit(offcanvas_id);
            }
        },
        error: function(xhr, status, error) {
            enable_submit(offcanvas_id);
        }
    });
}

// ---- user auth ----
function user_auth() {
    let token_data = JSON.parse(atob(USER_TOKEN));

    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'user/' + token_data.user_id + '/',
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                USER_DATA = msg.data.user;
            } else {
                USER_DATA = {};
            }
            update_navbar(USER_DATA);
        },
        error: function(xhr, status, error) {}
    });
}

// ---- user update ----
function user_update(user_id, user_summary) {
    let offcanvas_id = '#offcanvas-user-update';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'PUT',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'user/' + user_id + '/?user_summary=' + user_summary,
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                hide_offcanvas(offcanvas_id);
                hide_errors(offcanvas_id);
                enable_submit(offcanvas_id);
                show_offcanvas(offcanvas_id + '-after');

            } else {
                show_errors(offcanvas_id, msg.errors);
                enable_submit(offcanvas_id);
            }
        },
        error: function(xhr, status, error) {
            enable_submit(offcanvas_id);
        }
    });
}

// ---- upload image ----
function upload_image(user_file) {
    let offcanvas_id = '#offcanvas-user-update';

    if(!$.isEmptyObject(user_file)) {
        var formData = new FormData();
        formData.append('user_file', user_file);

        $.ajax({
            type: 'POST',
            headers: {'user-token': USER_TOKEN},
            url: APP_URL + 'image/',
            data: formData,
            dataType: 'json',
            cache: false,
            processData: false, 
            contentType: false,
            success: function(msg) {
                //console.log(msg);

                if($.isEmptyObject(msg.errors)) {
                    hide_errors(offcanvas_id);
                    enable_submit(offcanvas_id);

                    $(offcanvas_id + '-user-image').prop('src', msg.data.image_link);
                    $(offcanvas_id + '-user-image').removeClass('d-none');
                    $(offcanvas_id + '-user-file').val('');
    
                } else {
                    show_errors(offcanvas_id, msg.errors);
                    enable_submit(offcanvas_id);
                }
            },
            error: function(xhr, status, error) {
                enable_submit(offcanvas_id);
            }
        });
    }
}

// ---- user pass ----
function update_pass(user_pass, user_repass){
    let offcanvas_id = '#offcanvas-user-pass';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'PUT',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'pass/?user_pass=' + user_pass + '&user_repass=' + user_repass,
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                hide_offcanvas(offcanvas_id);
                clear_inputs(offcanvas_id);
                hide_errors(offcanvas_id);
                enable_submit(offcanvas_id);
                show_offcanvas(offcanvas_id + '-after');

            } else {
                show_errors(offcanvas_id, msg.errors);
                enable_submit(offcanvas_id);
            }
        },
        error: function(xhr, status, error) {
            enable_submit(offcanvas_id);
        }
    });
}

// ---- user select ----
function user_select(user_id) {
    let token_data = JSON.parse(atob(USER_TOKEN));
    let offcanvas_id = '#offcanvas-user-select';

    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'user/' + user_id + '/',
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                $(offcanvas_id + '-user-login').text(msg.data.user.user_login);
                $(offcanvas_id + '-user-status').text(msg.data.user.user_status);
                $(offcanvas_id + '-created').text(msg.data.user.created);

                if (msg.data.user.user_summary) {
                    $(offcanvas_id + '-user-summary').text(msg.data.user.user_summary);
                    $(offcanvas_id + '-row-user-summary').removeClass('d-none');
                } else {
                    $(offcanvas_id + '-user-summary').text('');
                    $(offcanvas_id + '-row-user-summary').addClass('d-none');
                }

                if(msg.data.user.meta.image_link) {
                    $(offcanvas_id + '-user-image').prop('src', msg.data.user.meta.image_link);
                    $(offcanvas_id + '-user-image').removeClass('d-none');
                    $(offcanvas_id + '-row-user-image').removeClass('d-none');
                } else {
                    $(offcanvas_id + '-user-image').prop('src', '');
                    $(offcanvas_id + '-user-image').addClass('d-none');
                    $(offcanvas_id + '-row-user-image').addClass('d-none');
                }
                //USER_DATA = msg.data.user;
            } else {
                //USER_DATA = {};
            }
            //update_navbar(USER_DATA);
        },
        error: function(xhr, status, error) {}
    });
}

// ---- user list ----
function users_list(offset=0) {
    $('#tab-users-rows').find('tbody').empty();
    $('#tab-users-pagination').find('ul').empty();

    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'users/' + offset + '/',
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                if (msg.data.users.length == 0) {
                    $('#tab-users-rows').addClass('d-none');

                } else {
                    $('#tab-users-rows').removeClass('d-none');
                
                    msg.data.users.forEach(function(user) {
                        $('#tab-users-rows').find('tbody').append(
                            '<tr>' +
                            '<th scope="row">' + user.id + '</th>' +
                            '<td>' + user.created + '</td>' +
                            '<td><a href="#" onclick="show_offcanvas_user_select(' + user.id + ');">' + user.user_login + '</a></td>' +
                            '<td>' + user.user_status + '</td>' +
                            '</tr>'
                        );
                    });
                    
                    pagination('tab-users-pagination', 'users_list', [], offset, msg.data.users_count, ROWS_LIMIT);
                }

            } else {}
            
        },
        error: function(xhr, status, error) {}
    });
}

