// ---- volumes list ----
function volumes_list() {
    $('#tab-volumes-rows').find('tbody').text('');

    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'volumes/',
        dataType: 'json',
        success: function(msg) {
            console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                msg.data.volumes.forEach(function(volume) {
                    $('#tab-volumes-rows').find('tbody').append(
                        '<tr>' +
                        '<th scope="row">' + volume.id + '</th>' +
                        '<td>' + volume.created + '</td>' +
                        '<td><a href="#">' + volume.volume_title + '</a></td>' +
                        '<td>' + volume.volume_currency + '</td>' +
                        '<td>' + volume.volume_sum + '</td>' +
                        '</tr>'
                    );
                });

            } else {
            }
        },
        error: function(xhr, status, error) {}
    });
}
