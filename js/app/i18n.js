$(document).ready(function(){

    // ---- enable tooltips ----
    $(document).ready(function(){
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    });

    // ---- show available languages in navbar ----
    $.each(LANGUAGES, function(k, v){
        $('#navbar-i18n').find('ul').append(
            $('<li>').append(
                $('<a>').attr('href','#').attr('class', 'dropdown-item').attr('data-language', k).append(v)
        ));
    });

    // ---- listen for toggle language in navbar ----
    $('#navbar-i18n').find('ul li a').click(function () {
        LOCALE = $(this).attr('data-language');
        $.cookie('user-locale', LOCALE, { expires: 365 });
        translateUI();
    });

    translateUI();
});

function translateUI() {
        // ---- toggle language in navbar ----
        $('#navbar-i18n').find('a.dropdown-toggle').text(LANGUAGES[LOCALE]);

        // ---- common UI elements ----
        I18N = eval('I18N_' + LOCALE);
        $.each(I18N, function(key, value){
            if(!key.startsWith('_')) {
                let el = $('body').find('[data-i18n="' + key + '"]');

                // no tooltips
                if (typeof value == 'string') {
                    el.text(value);
                    el.tooltip('dispose');

                // tooltips
                } else {
                    el.text(value[0]);
                    el.tooltip('dispose');
                    el.tooltip({title: value[1], delay: { show: 1000 }});
                }
            }
        });

        // ---- uncommon UI elements ----
        $('#navbar-search').find('input[type="search"]').attr('placeholder', I18N['_navbar-search']);

        // ---- currencies ----
        $.each(I18N['_currencies'], function(key, value){
            $('body').find('[data-i18n="offcanvas-volume-insert-volume-currency-' + key + '"]').text(value);
            $('body').find('[data-i18n="offcanvas-volume-update-volume-currency-' + key + '"]').text(value);
        });
}
