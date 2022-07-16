

// ---- posts list ----
function posts_list(volume_id=0, post_status='', post_title='', post_tag='', offset=0, volume_title='') {
    $('#tab-posts-rows').find('tbody').empty();
    $('#tab-posts-pagination').find('ul').empty();

    if(volume_id && post_status) {
        var url = APP_URL + 'posts/' + offset + '/?volume_id=' + volume_id + '&post_status=' + post_status;
        VOLUME_ID = volume_id;
        update_post_status('#tab-posts-post-status', volume_id, post_status, volume_title);
        hide_tab_posts_title();
        $('#tab-posts-title-by-volume').text(volume_title);
        $('#tab-posts-title-by-volume').removeClass('d-none');

        $('#tab-posts-volume-update').off('click');
        $('#tab-posts-volume-update').on('click', function() {show_offcanvas_volume_update(volume_id)});

    } else if(post_title) {
        VOLUME_ID = 0;
        var url = APP_URL + 'posts/' + offset + '/?post_title=' + post_title;
        $('#tab-posts-post-status').addClass('d-none');
        hide_tab_posts_title();
        $('#tab-posts-title-object').text('"' + post_title + '"');
        $('#tab-posts-title-object').removeClass('d-none');
        $('#tab-posts-title-by-title').removeClass('d-none');

    } else if (post_tag) {
        VOLUME_ID = 0;
        var url = APP_URL + 'posts/' + offset + '/?post_tag=' + post_tag;
        $('#tab-posts-post-status').addClass('d-none');
        hide_tab_posts_title();
        $('#tab-posts-title-object').text('"' + post_tag + '"');
        $('#tab-posts-title-object').removeClass('d-none');
        $('#tab-posts-title-by-tag').removeClass('d-none');
    
    // uncommon case
    } else {
        VOLUME_ID = 0;
        var url = APP_URL + 'posts/' + offset + '/';
        $('#tab-posts-post-status').addClass('d-none');
    }

    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: url,
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                if (msg.data.posts.length == 0) {
                    $('#tab-posts-rows').addClass('d-none');
                    $('#tab-posts-empty').removeClass('d-none');

                } else {
                    $('#tab-posts-rows').removeClass('d-none');
                    $('#tab-posts-empty').addClass('d-none');

                    msg.data.posts.forEach(function(post) {
                        $('#tab-posts-rows').find('tbody').append(
                            '<tr>' +
                            '<th scope="row">' + post.id + '</th>' +
                            '<td>' + datetime(post.created) + '</td>' +
                            '<td><a href="#" onclick="show_offcanvas_user_select(' + post.user_id + ');">' + post.user.user_login + '</a></td>' +
                            '<td><a href="#" onclick="show_comments(\'' + post.id + '\', 0);">' + post.post_title + '</a></td>' +
                            '<td>' + tags_list(post.tags) + '</td>' +
                            '<td>' + post.post_sum + '</td>' +
                            '<td>' + post.meta.comments_count + '</td>' +
                            '<td>' + post.meta.uploads_count + '</td>' +
                            '<td>' + post.meta.uploads_size + '</td>' +
                            '</tr>'
                        );
                    });

                    let args = [volume_id, post_status, post_title, post_tag];
                    pagination('tab-posts-pagination', 'posts_list', args, offset, msg.data.posts_count, ROWS_LIMIT);
                }

            } else {}
            
        },
        error: function(xhr, status, error) {}
    });
}


// ---- post insert ----
function post_insert(volume_id, category_id, post_status, post_title, post_content, post_sum, post_tags) {
    if($('#tab-posts').hasClass('d-none')) {
        $('#navbar-posts').click();
    }

    let offcanvas_id = '#offcanvas-post-insert';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'POST',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'post/?volume_id=' + volume_id + '&category_id=' + category_id + '&post_status=' + post_status + '&post_title=' + post_title + '&post_content=' + post_content + '&post_sum=' + post_sum + '&post_tags=' + post_tags,
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                hide_offcanvas(offcanvas_id);
                clear_inputs(offcanvas_id);
                enable_submit(offcanvas_id);
                posts_list(volume_id, post_status, '', '', 0);

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
