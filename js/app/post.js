// ---- posts list ----
function posts_list(volume_id=0, post_status='', post_title='', post_tag='', offset=0) {
    $('#tab-posts-rows').find('tbody').text('');

    if(volume_id && post_status) {
        var url = APP_URL + 'posts/' + offset + '/?volume_id=' + volume_id + '&post_status=' + post_status;

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

            
        },
        error: function(xhr, status, error) {}
    });
}
