// ---- posts list ----
function posts_list(volume_id=0, post_status='', post_title='', post_tag='', offset=0) {
    $('#tab-posts-rows').find('tbody').empty();

    if(volume_id && post_status) {
        var url = APP_URL + 'posts/' + offset + '/?volume_id=' + volume_id + '&post_status=' + post_status;
        VOLUME_ID = volume_id;

    } else if(post_title) {
        var url = '';

    } else if (post_tag) {
        var url = '';
    }

    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: url,
        dataType: 'json',
        success: function(msg) {
            console.log(msg);

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
                            '</tr>'
                        );
                    });
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
            console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                //hide_offcanvas(offcanvas_id);
                clear_inputs(offcanvas_id);
                enable_submit(offcanvas_id);
                //posts_list();

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
