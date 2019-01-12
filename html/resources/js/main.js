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
})