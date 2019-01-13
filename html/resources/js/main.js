$(function(){
    // MMENU
    var mobileMenu = $('.mobile-menu')

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
    })

    var api = mobileMenu.data('mmenu')

    $('.mobile-open').click(function () {
        if ($('html').hasClass('mm-opened')) {
            api.close()
        } else {
            api.open()
        }
    })

    $('.go-to-pledge').click(function (e){
        e.preventDefault();

        $('html, body').animate({
            scrollTop: $('#pledge').offset().top
        }, 2000);
    });

    $('.range').change(function() {
        var meters = $(this).val();

        var miles = meters / 1609.344;

        $('.range-number').val(meters);

        $('.miles-number').text(miles.toFixed(1));
    });
})