

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
                //console.log(msg);

                if($.isEmptyObject(msg.errors)) {
                    //hide_offcanvas(offcanvas_id);
                    clear_inputs(offcanvas_id);
                    enable_submit(offcanvas_id);
                    //comments_list(post_id, 0);

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
