// -- i18n --
$(document).ready(function(){
    $.each(I18N, function(key, value) {
        if(!I18N_IGNORE.includes(key)) {
            $.each(I18N[key], function(k, v) {
                console.log('#' + key + '-' + k);
                $('#' + key + '-' + k).text(v);
            });
        }
    });
    $('#navbar-search-input').attr('placeholder', I18N['navbar-search-input']);
});
