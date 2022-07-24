// ---- populate dropdown ----
function categories_dropdown(dropdown_id, category_id=null) {
    $(dropdown_id).empty();
    $(dropdown_id).append(
        $('<option>').attr('value', '').text('')
    );

    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'categories/',
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                if (msg.data.categories.length > 0) {
                    $.each(msg.data.categories, function(key, category){
                        let el = $('<option>').attr('value', category.id).text(category.category_title);
                        if(category_id && category.id == category_id) {
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


// ---- categories list ----
function categories_list() {
    $('#tab-categories-rows').find('tbody').empty();

    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'categories/',
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                if (msg.data.categories.length == 0) {
                    $('#tab-categories-rows').addClass('d-none');
                    $('#tab-categories-empty').removeClass('d-none');

                } else {
                    $('#tab-categories-rows').removeClass('d-none');
                    $('#tab-categories-empty').addClass('d-none');

                    msg.data.categories.forEach(function(category) {
                        $('#tab-categories-rows').find('tbody').append(
                            '<tr>' +
                            '<th scope="row">' + category.id + '</th>' +
                            '<td>' + category.created + '</td>' +
                            '<td>' + category.category_title + '</td>' +
                            '</tr>'
                        );
                    });
                }
                
            } else {}
        },
        error: function(xhr, status, error) {}
    });
}

// ---- category insert ----
function category_insert(category_title, category_summary) {
    if($('#tab-categories').hasClass('d-none')) {
        $('#navbar-categories').click();
    }

    let offcanvas_id = '#offcanvas-category-insert';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'POST',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'category/?category_title=' + category_title + '&category_summary=' + category_summary,
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                hide_offcanvas(offcanvas_id);
                clear_inputs(offcanvas_id);
                enable_submit(offcanvas_id);
                categories_list();

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
