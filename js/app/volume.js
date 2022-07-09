// ---- volumes list ----
function volumes_list() {
    $('#tab-volumes-rows').find('tbody').text('');

    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'volumes/',
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                msg.data.volumes.forEach(function(volume) {
                    let posts_count = volume.meta.posts_count !== undefined ? volume.meta.posts_count : '0';
                    $('#tab-volumes-rows').find('tbody').append(
                        '<tr>' +
                        '<th scope="row">' + volume.id + '</th>' +
                        '<td>' + volume.created + '</td>' +
                        '<td><a href="#">' + volume.volume_title + '</a></td>' +
                        '<td>' + posts_count + '</td>' +
                        '<td>' + volume.volume_currency + '</td>' +
                        '<td class="fw-bold">' + volume.volume_sum + '</td>' +
                        '</tr>'
                    );
                });

            } else {
            }
        },
        error: function(xhr, status, error) {}
    });
}

// ---- volume insert ----
function volume_insert(volume_title, volume_summary, volume_currency) {
    let offcanvas_id = '#offcanvas-volume-insert';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'POST',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'volume/?volume_title=' + volume_title + '&volume_summary=' + volume_summary + '&volume_currency=' + volume_currency,
        dataType: 'json',
        success: function(msg) {
            console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                hide_offcanvas(offcanvas_id);
                clear_inputs(offcanvas_id);
                enable_submit(offcanvas_id);
                volumes_list();

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
