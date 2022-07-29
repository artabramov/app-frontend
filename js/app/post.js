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
        //$('#tab-posts-volume-delete').on('click', function() {show_offcanvas_volume_delete(volume_id)});

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
                            '<td>' + post.category.category_title + '</td>' +
                            '<td><a href="#" onclick="show_comments(\'' + post.id + '\', 0);">' + post.post_title + '</a></td>' +
                            '<td>' + format_number(post.meta.comments_count) + '</td>' +
                            '<td>' + tags_list(post.tags) + '</td>' +
                            '<td class="text-end fw-bold">' + format_sum(post.post_sum) + '</td>' +
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

// ---- post update ----
function post_update(post_id, volume_id, category_id, post_status, post_title, post_content, post_sum, post_tags) {
    //if($('#tab-posts').hasClass('d-none')) {
    //    $('#navbar-posts').click();
    //}

    let offcanvas_id = '#offcanvas-post-update';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'PUT',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'post/' + post_id + '/?volume_id=' + volume_id + '&category_id=' + category_id + '&post_status=' + post_status + '&post_title=' + post_title + '&post_content=' + post_content + '&post_sum=' + post_sum + '&post_tags=' + post_tags,
        dataType: 'json',
        success: function(msg) {
            console.log(msg);

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

// ---- post delete ----
function post_delete(post_id) {
    let offcanvas_id = '#offcanvas-post-delete';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'DELETE',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'post/' + post_id + '/',
        dataType: 'json',
        success: function(msg) {
            console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                hide_offcanvas(offcanvas_id);
                enable_submit(offcanvas_id);
                //show_posts(volume_id, 'doing', '', '', 0, volume_title);
                //volumes_list();
                //hide_tabs();
                $('#navbar-posts').click();

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

// ---- populate offcanvas post update ----
function fill_offcanvas_post_update(post_id) {
    let offcanvas_id = '#offcanvas-post-update';

    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'post/' + post_id + '/',
        dataType: 'json',
        success: function(msg) {
            console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                $(offcanvas_id + '-post-id').val(msg.data.post.id);
                $(offcanvas_id + '-post-title').val(msg.data.post.post_title);
                $(offcanvas_id + '-post-status').val(msg.data.post.post_status);
                $(offcanvas_id + '-post-content').val(msg.data.post.post_content);
                $(offcanvas_id + '-post-sum').val(msg.data.post.post_sum);
                $(offcanvas_id + '-post-tags').val(tags_string(msg.data.post.tags));
                $(offcanvas_id + '-volume-title').text(msg.data.post.volume.volume_title);
                categories_dropdown(offcanvas_id + '-category-id', msg.data.post.category_id);

            } else {
                //USER_DATA = {};
            }
        },
        error: function(xhr, status, error) {}
    });
}
