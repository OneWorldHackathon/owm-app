$(function(){
    // CYCLE DELAY TIME
    $.fn.cycleDelay = function(delayTime) {
        var delay = 0,
            element = $(this);

        element.each(function(){
            $(this).css({
                '-webkit-transition-delay' : delay+'s, '+ delay +'s',
                '-moz-transition-delay' : delay+'s, '+ delay +'s',
                '-ms-transition-delay' : delay+'s, '+ delay +'s',
                '-o-transition-delay' : delay+'s, '+ delay +'s',
                'transition-delay' : delay+'s, '+ delay +'s'
            });

            delay = delay + delayTime;
        })
    };

    // MMENU
    var mobileMenu = $('.mobile-menu');

    mobileMenu.mmenu({
        counters: true,
        offCanvas: {
            zposition: 'back',
            position: 'right'
        }
    }, {
        classNames: {
            fixedElements: {
                fixed: 'fix'
            }
        }
    });

    var api = mobileMenu.data('mmenu');

    $('.mobile-open').click(function () {
        if ($('html').hasClass('mm-opened')) {
            api.close()
        } else {
            api.open()
        }
    });

    // GO TO PLEDGE
    $('.go-to-pledge').click(function (e){
        e.preventDefault();

        $('html, body').animate({
            scrollTop: $('#pledge').offset().top
        }, 2000);
    });

    // RANGE
    $('.range').change(function() {
        var meters = $(this).val();

        var miles = meters / 1609.344;

        $('.range-number').val(meters);

        $('.miles-number').text(miles.toFixed(1));
    });

    // ANIMS
    $('#splash').find('.logo, .strap').cycleDelay(0.2);

    $('#header, #splash').addClass('anim');


});