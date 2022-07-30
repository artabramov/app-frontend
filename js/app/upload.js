

// ---- uploads insert ----
function uploads_insert(post_id, user_files) {
    let offcanvas_id = '#offcanvas-uploads-insert';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    
    if(!$.isEmptyObject(user_files)) {
        var formData = new FormData();
        Array.from(user_files).forEach(function(user_file) {
            formData.append('user_files', user_file);
            //console.log(user_file);
        });

        $.ajax({
            method: 'POST',
            headers: {'user-token': USER_TOKEN},
            data: formData,
            dataType: 'json',
            cache: false,
            processData: false, 
            contentType: false,
            url: APP_URL + 'uploads/?post_id=' + post_id,
            dataType: 'json',
            success: function(msg) {
                console.log(msg);

                if($.isEmptyObject(msg.errors)) {
                    hide_offcanvas(offcanvas_id);
                    clear_inputs(offcanvas_id);
                    enable_submit(offcanvas_id);
                    uploads_list(post_id);

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

// ---- uploads list ----
function uploads_list(post_id) {
    $('#tab-comments-uploads-rows').empty();

    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + '/uploads/' + post_id + '/',
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                if (msg.data.uploads.length == 0) {
                    $('#tab-comments-uploads-rows').addClass('d-none');
                    $('#tab-comments-uploads-empty').removeClass('d-none');

                } else {
                    $('#tab-comments-uploads-rows').removeClass('d-none');
                    $('#tab-comments-uploads-empty').addClass('d-none');
                
                    msg.data.uploads.forEach(function(upload) {
                        $('#tab-comments-uploads-rows').append(
                            '<div class="border border-secondary rounded m-0 mb-3 p-3" onmouseover="show_actions(\'#actions-upload-id-' + upload.id + '\');" onmouseout="hide_actions(\'#actions-upload-id-' + upload.id + '\');">' +
                            '<a href="' + upload.upload_link + '" target="_blank">' + upload.upload_name + '</a> ' + filesize(upload.upload_size, I18N._sizes) + 
                            ' ' +
                            '<span id="actions-upload-id-' + upload.id + '" class="d-none">' +
                            '<a href="#" onclick="show_offcanvas_upload_delete(' + upload.id + ');">delete</a>' +
                            '</span>' + 
                            '</div>'
                        );
                    });
                }

            } else {}
            
        },
        error: function(xhr, status, error) {}
    });
}

// delete upload
function upload_delete(upload_id) {
    let offcanvas_id = '#offcanvas-upload-delete';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'DELETE',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'upload/' + upload_id + '/',
        dataType: 'json',
        success: function(msg) {
            console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                hide_offcanvas(offcanvas_id);
                enable_submit(offcanvas_id);
                //show_posts(volume_id, 'doing', '', '', 0, volume_title);
                //volumes_list();
                //hide_tabs();
                //$('#navbar-posts').click();
                comments_list(POST_ID, 0);

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
