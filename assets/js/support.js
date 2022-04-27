function fadeContents($href, $elm, $tofade) {
    window.location.hash = $href;
    $tofade.fadeOut('100', function() {
        if ($('.support-navigation').css('display') == 'none') {
            $('.support-navigation').fadeIn();
        }
        $elm.fadeIn();
    });
    $elm.addClass('support-active');
    $tofade.removeClass('support-active');
    retract_nav();
}

function retract_nav() {
    $('.support-nav-main-link').parent().addClass('inactive');
    $('.support-nav-main-link').parent().animate({
        height: 15
    }, 200);
}

$(document).ready(function() {
    $('.fadecontent').click(function(e) {
        e.preventDefault();
        $('.lime-link').removeClass('lime-link');
        $(this).addClass('lime-link');
        var $href = $(this).attr('href');
        var $elm = $($href);
        var $tofade = $('div.support-active');
        fadeContents($href, $elm, $tofade);
    });

    $('.support-nav-main-link').click(function(e) {
        e.preventDefault();
        var $ulHeight = $('.support-nav-top-level').height() + 25;
        if ($(this).parent().hasClass('inactive')) {
            $(this).parent().removeClass('inactive');
            $(this).parent().animate({
                height: $ulHeight
            }, 200);
        } else {
            $(this).parent().addClass('inactive');
            $(this).parent().animate({
                height: 15
            }, 200);
        }
    });

    $('a.toggle-another').click(function(e) {
        e.preventDefault();

        var isToggleAnotherDisplaying = ($(this).css('display') == 'none') ? false : true;

        // var $toggleAnother = $(this).find('.toggle-another');

        if (isToggleAnotherDisplaying) {
            var innerListClassSelector = $(this).data('toggle');
            $(this).toggleClass('open');
            $("#" + innerListClassSelector).toggleClass('open');
        }
    });

    $(".faq_table_holder table tr:odd").addClass("odd");
});