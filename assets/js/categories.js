$(window).load(function() {
    if ($('div.top_tout').children().length > 1) {
        $('div.top_tout').orbit({
            directionalNav: false,
            bullets: true,
            timer: true,
            bulletsExtraClass: "bullets_tout_images_triple_wide"
        });
    }

    $('.left_touts').each(function() {
        if ($(this).children().length > 1) {
            $(this).orbit({
                directionalNav: false,
                bullets: true,
                timer: false,
                directionalNav: false,
                bulletsExtraClass: "category-left-bullets"
            });
        }
    });

    //find all children with "autofade"
    var $autofader = $('#addautofade');
    var $autofadeParent = $autofader.parent();
    var $autofadeChildrenCount = $autofadeParent.children().length;
    if ($autofadeChildrenCount > 1) {
        $autofadeParent.orbit({
            directionalNav: false,
            animation: "fade",
            bullets: true,
            timer: true,
            //			bulletsExtraClass : "bullets_tout_images_triple_wide"
            bullets: false
        });
        $autofadeParent.parent().css("float", "left");
    }
});

function $_GET(q, s) {
    s = s ? s : window.location.search;
    var re = new RegExp('&' + q + '(?:=([^&]*))?(?=&|$)', 'i');
    return ((s = s.replace(/^\?/, '&').match(re)) ? (typeof s[1] == 'undefined' ? '' : decodeURIComponent(s[1])) : undefined);
}

var config = {
    over: function() {
        $(this).children('ul').slideToggle('fast');
        $(this).children('.dropdown-arrow').addClass('dropdown-arrow-hover');
    },
    timeout: 100,
    out: function() {
        $(this).children('ul').slideToggle('fast');
        $(this).children('.dropdown-arrow').removeClass('dropdown-arrow-hover');
    }
};
$(document).ready(function() {
    var tab_to_switch = $_GET('t');
    if (tab_to_switch) {
        var current_topic = $('.current-topic');
        var rel = $('.current-topic').attr('rel');
        $('#' + rel).hide();
        current_topic.removeClass('current-topic');
        $('#product_link' + tab_to_switch).addClass('current-topic');
        rel = $('.current-topic').attr('rel');
        $('#' + rel).show();
    }
    $('div.dropdown div.holder').hoverIntent(config);
    $('#menu_Tab a').each(function() {
        $(this).click(function(e) {
            e.preventDefault();
            var current_topic = $('.current-topic');
            var rel = $('.current-topic').attr('rel');
            $('#' + rel).hide();
            current_topic.removeClass('current-topic');
            $(this).addClass('current-topic');
            rel = $('.current-topic').attr('rel');
            $('#' + rel).show();
        });
    });

    $("div.what_you_like_content a").click(function() {

        title = $(this).children("div.what_you_like_title").html().replace(/(\r\n|\n|\r)/gm, "");
        var store_gtm_data = {
            'Category': 'Store You May Also Like',
            'Action': site.short_name + ' store_prod click',
            'Label': title
        };
        dataLayer.push(store_gtm_data);
        console.log(store_gtm_data);

    });
});