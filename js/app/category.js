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
                            '<tr onmouseover="show_actions(\'#actions-category-id-' + category.id + '\');" onmouseout="hide_actions(\'#actions-category-id-' + category.id + '\');">' +
                            '<th scope="row">' + category.id + '</th>' +
                            '<td>' + category.created + '</td>' +
                            '<td>' + 
                            category.category_title + 
                            ' <span id="actions-category-id-' + category.id + '" class="d-none">' + 
                            '<button type="button" class="btn btn-outline-primary btn-sm" onclick="show_offcanvas_category_update(' + category.id + ');">Update category</button> ' +
                            '<button type="button" class="btn btn-outline-danger btn-sm" onclick="show_offcanvas_category_delete(' + category.id + ');">Delete category</button>' +
                            '<span>' +
                            '</td>' +
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

// ---- populate offcanvas volume update ----
function fill_offcanvas_category_update(category_id) {
    let offcanvas_id = '#offcanvas-category-update';

    $.ajax({
        method: 'GET',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'category/' + category_id + '/',
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                $(offcanvas_id + '-category-id').val(msg.data.category.id);
                $(offcanvas_id + '-category-title').val(msg.data.category.category_title);
                $(offcanvas_id + '-category-summary').val(msg.data.category.category_summary);

            } else {
                //USER_DATA = {};
            }
            //update_navbar(USER_DATA);
        },
        error: function(xhr, status, error) {}
    });
}

// ---- update category ----
function category_update(category_id, category_title, category_summary) {
    let offcanvas_id = '#offcanvas-category-update';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'PUT',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'category/' + category_id + '/?category_title=' + category_title + '&category_summary=' + category_summary,
        dataType: 'json',
        success: function(msg) {
            console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                hide_offcanvas(offcanvas_id);
                clear_inputs(offcanvas_id);
                enable_submit(offcanvas_id);
                categories_list();
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

// ---- category delete ----
function category_delete(category_id) {
    let offcanvas_id = '#offcanvas-category-delete';
    hide_errors(offcanvas_id);
    disable_submit(offcanvas_id);

    $.ajax({
        method: 'DELETE',
        headers: {'user-token': USER_TOKEN},
        url: APP_URL + 'category/' + category_id + '/',
        dataType: 'json',
        success: function(msg) {
            //console.log(msg);

            if($.isEmptyObject(msg.errors)) {
                hide_offcanvas(offcanvas_id);
                enable_submit(offcanvas_id);
                //show_posts(volume_id, 'doing', '', '', 0, volume_title);
                //volumes_list();
                //hide_tabs();
                $('#navbar-categories').click();

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
