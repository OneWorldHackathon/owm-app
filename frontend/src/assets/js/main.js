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

    // READ MORE
    $('.block p').on('click', function(){
        var block = $(this).closest('.block');

        if (!block.hasClass('.anim')){
            block.find('p:nth-of-type(n+2)').each(function(){
                var element = $(this);
                element.animate({'max-height' : element[0].scrollHeight}, 200)
            });

            block.addClass('anim');
        }
    });
});

function initTicker() {

    // WAYPOINT DECOUPLED
    var ticking = false;
    var tickerElem = $('.counter');
    var elem;

    $.fn.animateTicker = function(){
        var tick = $(this);
        tick.addClass('anim');
        var tickerCurrent = 0;
        var tickerVal = tick.data('tick');
        var increment = parseInt(tickerVal) / 180; // to iterate value over 3 seconds @ 60fps

        function tickIterate(){
            if (tickerVal > tickerCurrent) {
                tick.text(tickerCurrent.toFixed(0));
                tickerCurrent = tickerCurrent + increment;
                setTimeout(tickIterate, 1 / 60);
            } else {
                tick.text(tickerVal);
            }
        }
        tickIterate();
    }

    function ticker() {
        tickerElem.each(function(){
            elem = $(this);
            if (elem.offset().top < window.pageYOffset + window.innerHeight - 100 && !elem.hasClass('anim')) {
                elem.animateTicker();
            }
        })
    }

    function update () {
        ticking = false;

        ticker();
    }

    function onScroll () {
        ticking = ticking || requestAnimationFrame(update)
    }

    onScroll();
    window.addEventListener('scroll', onScroll, false);
    window.addEventListener('resize', onScroll, false);
}