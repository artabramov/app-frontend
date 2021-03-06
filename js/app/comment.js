// ---- comments list ----
function comments_list(post_id, offset=0) {
    //refresh_tab('comments_list', post_id + ', ' + offset);
    $('#tab-comments-rows').empty();
    $('#tab-comments-pagination').find('ul').empty();

    POST_ID = post_id;

    $('#tab-comments-post-update').off('click');
    $('#tab-comments-post-update').on('click', function() {show_offcanvas_post_update(post_id)});

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
                $('#tab-comments-post-user').html('<a href="#" onclick="show_offcanvas_user_select(' + msg.data.post.user_id + ');">' + msg.data.post.user.user_login + '</a>');
                $('#tab-comments-post-created').text(datetime(msg.data.post.created));
                $('#tab-comments-post-tags').html(tags_list(msg.data.post.tags));
                //
                $('#tab-comments-post-title').text(msg.data.post.post_title);
                $('#tab-comments-post-content').text(msg.data.post.post_content);
                //
                if(msg.data.post.category) {
                    $('#tab-comments-category-title').text(msg.data.post.category.category_title);
                    $('#tab-comments-category-title').removeClass('d-none');
                } else {
                    $('#tab-comments-category-title').text('');
                    $('#tab-comments-category-title').addClass('d-none');
                }
                //
                $('#tab-comments-volume-currency').text(msg.data.post.volume.volume_currency);
                $('#tab-comments-post-sum').html(format_sum(msg.data.post.post_sum, true));
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
            console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                if (msg.data.comments.length == 0) {
                    $('#tab-comments-rows').addClass('d-none');
                    $('#tab-comments-empty').removeClass('d-none');

                } else {
                    $('#tab-comments-rows').removeClass('d-none');
                    $('#tab-comments-empty').addClass('d-none');
                
                    msg.data.comments.forEach(function(comment) {
                        $('#tab-comments-rows').append(
                            '<div class="alert alert-secondary" role="alert">' +
                            '<p>' + 
                            '<span id="comment-id-' + comment.id + '">' + comment.comment_content + '</span>' + 
                            '</p>' +
                            '<hr>' +
                            '<div onmouseover="show_actions(\'#actions-comment-id-' + comment.id + '\');" onmouseout="hide_actions(\'#actions-comment-id-' + comment.id + '\');">' +
                            '<a href="#" onclick="show_offcanvas_user_select(' + comment.user_id + ');">' + comment.user.user_login + '</a>, ' +
                            '<span class="text-secondary">' + datetime(comment.created) + '</span>' +
                            '<span id="actions-comment-id-' + comment.id + '" class="d-none">' +
                            ' ' +
                            '<a href="#" class="link-primary ms-3" onclick="show_offcanvas_comment_update(' + comment.id + ');">' + I18N['_actions']['update'] + '</a> ' +
                            '<a href="#" class="link-danger ms-2" onclick="show_offcanvas_comment_delete(' + comment.id + ');">' + I18N['_actions']['delete'] + '</a>' +
                            '</span>' + 
                            '</div>' +
                            '</div>'
                        );
                    });
                    
                    let args = [post_id];
                    pagination('tab-comments-pagination', 'comments_list', args, offset, msg.data.comments_count, ROWS_LIMIT);
                }

            } else {}
            
        },
        error: function(xhr, status, error) {}
    });

    /*
    // select uploads
    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + '/uploads/' + post_id + '/',
        dataType: 'json',
        success: function(msg) {
            console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                if (msg.data.uploads.length == 0) {
                    $('#tab-comments-uploads-rows').addClass('d-none');
                    $('#tab-comments-uploads-empty').removeClass('d-none');

                } else {
                    $('#tab-comments-uploads-rows').removeClass('d-none');
                    $('#tab-comments-uploads-empty').addClass('d-none');
                
                    msg.data.uploads.forEach(function(upload) {
                        $('#tab-comments-uploads-rows').append(
                            '<p><a href="' + upload.upload_link + '" target="_blank">' + upload.upload_name + '</a> ' + filesize(upload.upload_size, I18N._sizes) + '</p>'
                        );
                    });
                }

            } else {}
            
        },
        error: function(xhr, status, error) {}
    });
    */
   uploads_list(post_id);
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

// comment update
function comment_update(comment_id, comment_content) {
    //if($('#tab-posts').hasClass('d-none')) {
    //    $('#navbar-posts').click();
    //}

    let offcanvas_id = '#offcanvas-comment-update';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'PUT',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'comment/' + comment_id + '/?comment_content=' + comment_content,
        dataType: 'json',
        success: function(msg) {
            console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                hide_offcanvas(offcanvas_id);
                clear_inputs(offcanvas_id);
                enable_submit(offcanvas_id);
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

// comment delete
function comment_delete(comment_id) {
    let offcanvas_id = '#offcanvas-comment-delete';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'DELETE',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'comment/' + comment_id + '/',
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