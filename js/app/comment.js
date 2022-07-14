// ---- comments list ----
function comments_list(post_id, offset=0) {
    $('#tab-comments-rows').empty();
    $('#tab-comments-pagination').find('ul').empty();

    POST_ID = post_id;

    // select post
    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'post/' + post_id + '/',
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                $('#tab-comments-volume-title').text(msg.data.post.volume.volume_title);
                $('#tab-comments-volume-title').attr('onclick', 'show_posts(' + msg.data.post.volume_id + ', \'' + msg.data.post.post_status + '\', \'\', \'\', 0, \'' + msg.data.post.volume.volume_title + '\');');
                //
                $('#tab-comments-post-title').text(msg.data.post.post_title);
                $('#tab-comments-post-content').text(msg.data.post.post_content);
            }
            
        },
        error: function(xhr, status, error) {}
    });

    // select comments
    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'post/' + post_id + '/comments/' + offset + '/',
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                if (msg.data.comments.length == 0) {
                    $('#tab-comments-rows').addClass('d-none');
                    $('#tab-comments-empty').removeClass('d-none');

                } else {
                    $('#tab-comments-rows').removeClass('d-none');
                    $('#tab-comments-empty').addClass('d-none');
                
                    msg.data.comments.forEach(function(comment) {
                        $('#tab-comments-rows').append(
                            '<p>' + comment.comment_content + '</p>'
                        );
                    });
                    
                    let args = [post_id];
                    pagination('tab-comments-pagination', 'comments_list', args, offset, msg.data.comments_count, ROWS_LIMIT);
                }

            } else {}
            
        },
        error: function(xhr, status, error) {}
    });
}

// ---- comment insert ----
function comment_insert(post_id, comment_content) {
    let offcanvas_id = '#offcanvas-comment-insert';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'POST',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'comment/?post_id=' + post_id + '&comment_content=' + comment_content,
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                hide_offcanvas(offcanvas_id);
                clear_inputs(offcanvas_id);
                enable_submit(offcanvas_id);
                comments_list(post_id, 0);

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
