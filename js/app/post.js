// ---- posts list ----
function posts_list(volume_id=0, post_status='', post_title='', post_tag='', offset=0) {
    $('#tab-posts-rows').find('tbody').empty();
    $('#tab-posts-pagination').find('ul').empty();

    if(volume_id && post_status) {
        var url = APP_URL + 'posts/' + offset + '/?volume_id=' + volume_id + '&post_status=' + post_status;
        VOLUME_ID = volume_id;
        POST_STATUS = post_status;
        POST_TITLE = post_title;
        POST_TAG = post_tag;
        OFFSET = offset;

        // status switch
        $('#tab-posts-post-status').removeClass('d-none');
        $('#tab-posts-post-status-draft').removeClass('active');
        $('#tab-posts-post-status-todo').removeClass('active');
        $('#tab-posts-post-status-doing').removeClass('active');
        $('#tab-posts-post-status-done').removeClass('active');
        if(POST_STATUS == 'draft') {
            $('#tab-posts-post-status-draft').addClass('active');
        } else if(POST_STATUS == 'todo') {
            $('#tab-posts-post-status-todo').addClass('active');
        } else if(POST_STATUS == 'doing') {
            $('#tab-posts-post-status-doing').addClass('active');
        } else if(POST_STATUS == 'done') {
            $('#tab-posts-post-status-done').addClass('active');
        }
        
        $('#tab-posts-post-status-draft').off('click');
        $('#tab-posts-post-status-draft').on('click', function() {posts_list(VOLUME_ID, 'draft', '', '', 0)});
        $('#tab-posts-post-status-todo').off('click');
        $('#tab-posts-post-status-todo').on('click', function() {posts_list(VOLUME_ID, 'todo', '', '', 0)});
        $('#tab-posts-post-status-doing').off('click');
        $('#tab-posts-post-status-doing').on('click', function() {posts_list(VOLUME_ID, 'doing', '', '', 0)});
        $('#tab-posts-post-status-done').off('click');
        $('#tab-posts-post-status-done').on('click', function() {posts_list(VOLUME_ID, 'done', '', '', 0)});

    } else if(post_title) {
        var url = '';
        $('#tab-posts-post-status').addClass('d-none');

    } else if (post_tag) {
        var url = '';
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
                            '<td>' + post.created + '</td>' +
                            '<td>' + post.post_title + '</td>' +
                            '<td>' + post.post_sum + '</td>' +
                            '</tr>'
                        );
                    });

                    pagination('tab-posts-pagination', 'posts_list', offset, msg.data.posts_count);
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
