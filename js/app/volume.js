// ---- populate dropdown ----
function volumes_dropdown(dropdown_id, volume_id=null) {
    $(dropdown_id).empty();
    $(dropdown_id).append(
        $('<option>').attr('value', '').text('')
    );

    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'volumes/',
        dataType: 'json',
        success: function(msg) {
            if($.isEmptyObject(msg.errors)) {
                if (msg.data.volumes.length > 0) {
                    $.each(msg.data.volumes, function(key, value){
                        let el = $('<option>').attr('value', value.id).text(value.volume_title);
                        if(volume_id && value.id == volume_id) {
                            el.attr('selected', 'selected');
                        }
                        $(dropdown_id).append(el);
                    });
                }
            }
        },
        error: function(xhr, status, error) {}
    });
}

// ---- populate offcanvas volume update ----
function fill_offcanvas_volume_update(volume_id) {
    let offcanvas_id = '#offcanvas-volume-update';

    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'volume/' + volume_id + '/',
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                $(offcanvas_id + '-volume-id').val(msg.data.volume.id);
                $(offcanvas_id + '-volume-title').val(msg.data.volume.volume_title);
                $(offcanvas_id + '-volume-summary').val(msg.data.volume.volume_summary);
                $(offcanvas_id + '-volume-currency').val(msg.data.volume.volume_currency);

            } else {
                //USER_DATA = {};
            }
            //update_navbar(USER_DATA);
        },
        error: function(xhr, status, error) {}
    });
}

// ---- volumes list ----
function volumes_list() {
    $('#tab-volumes-rows').find('tbody').empty();

    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'volumes/',
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                if (msg.data.volumes.length == 0) {
                    $('#tab-volumes-rows').addClass('d-none');
                    $('#tab-volumes-empty').removeClass('d-none');

                } else {
                    $('#tab-volumes-rows').removeClass('d-none');
                    $('#tab-volumes-empty').addClass('d-none');

                    msg.data.volumes.forEach(function(volume) {
                        let posts_count = volume.meta.posts_count !== undefined ? volume.meta.posts_count : '0';
                        $('#tab-volumes-rows').find('tbody').append(
                            '<tr>' +
                            '<th scope="row">' + volume.id + '</th>' +
                            '<td>' + datetime(volume.created) + '</td>' +
                            '<td><a href="#" onclick="show_posts(' + volume.id + ', \'doing\', \'\', \'\', 0, \'' + volume.volume_title + '\');">' + volume.volume_title + '</a></td>' +
                            '<td>' + posts_count + '</td>' +
                            '<td>' + volume.volume_currency + '</td>' +
                            '<td class="text-end fw-bold">' + format_sum(volume.volume_sum) + '</td>' +
                            '</tr>'
                        );
                    });
                }
                
            } else {}
        },
        error: function(xhr, status, error) {}
    });
}

// ---- volume insert ----
function volume_insert(volume_title, volume_summary, volume_currency) {
    if($('#tab-volumes').hasClass('d-none')) {
        $('#navbar-volumes').click();
    }

    let offcanvas_id = '#offcanvas-volume-insert';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'POST',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'volume/?volume_title=' + volume_title + '&volume_summary=' + volume_summary + '&volume_currency=' + volume_currency,
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

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

// ---- volume update ----
function volume_update(volume_id, volume_title, volume_summary, volume_currency) {
    let offcanvas_id = '#offcanvas-volume-update';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'PUT',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'volume/' + volume_id + '/?volume_title=' + volume_title + '&volume_summary=' + volume_summary + '&volume_currency=' + volume_currency,
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                hide_offcanvas(offcanvas_id);
                clear_inputs(offcanvas_id);
                enable_submit(offcanvas_id);
                show_posts(volume_id, 'doing', '', '', 0, volume_title);
                //volumes_list();

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

// ---- volume delete ----
function volume_delete(volume_id) {
    let offcanvas_id = '#offcanvas-volume-delete';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'DELETE',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'volume/' + volume_id + '/',
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                hide_offcanvas(offcanvas_id);
                enable_submit(offcanvas_id);
                //show_posts(volume_id, 'doing', '', '', 0, volume_title);
                //volumes_list();
                //hide_tabs();
                $('#navbar-volumes').click();

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
