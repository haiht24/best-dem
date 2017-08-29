

jQuery(document).ready(function() {
    jQuery(".st-carousel").each(  function( i ) {
        //return false ;
        var s = jQuery( this );
        if ( s.hasClass('slider-added' ) ) {
           return false ;
        }

        s.addClass( 'slider-added' );
        var settings = s.attr('data-settings');
        try {
            settings = JSON.parse( settings );
        }catch (e) {

        }

        var _default =  {
            navigation : true, // Show next and prev buttons
            navigationText : false,
            //pagination : true,
            //paginationNumbers: true,
            slideSpeed : 300,
            paginationSpeed : 400,
            rewindNav: true,
            //singleItem: false,
            autoPlay: true,
            stopOnHover: true,
            // "singleItem:true" is a shortcut for:
            items : 5,
            //itemsDesktop : 5,
            itemsDesktopSmall : 4,
            //itemsTablet: 3,
            itemsMobile : 2,
            lazyLoad : true,
            afterInit: function(){
                setTimeout(  function(){
                    s.closest( '.widget').fadeIn(500);
                }, 100 );
            }
        };

        // Merge object2 into object1
        jQuery.extend( _default , settings );

        //console.log( _default );
        s.owlCarousel( _default );


    } ) ;

});