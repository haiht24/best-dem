/**
 * Set Cookie
 *
 * @param cname
 * @param cvalue
 * @param exdays
 */
function setCookie( cname, cvalue, exdays ) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

/**
 * Get Cookie
 *
 * @param cname
 * @returns {string}
 */
function getCookie( cname ) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function isEmail( email ) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test( email );
}

function string_to_number( string ) {
    if ( typeof string === 'number' ) {
        return string;
    }
    if ( typeof string === 'string' ) {
        var n = string.match(/\d+$/);
        if (n) {
            return parseFloat(n[0]);
        } else {
            return 0;
        }
    }
    return 0;
}


var is_support_copy_command = function(){
    if ( typeof document.queryCommandSupported !== "undefined" ) {
        return document.queryCommandSupported("copy");
    }
    return false;
};


function copyText( text ){

    if ( ! is_support_copy_command() ) {
        return false;
    }
    var $el =  jQuery( '<textarea style="opacity: 0;position: absolute;top: -10000px;right: 0;" id="wp-coupon-input-copy"></textarea>' );
    $el.val( text );

    jQuery( 'body').append( $el );
    var input  = document.getElementById("wp-coupon-input-copy");
    input.select();
    var successful = false;
    try {
        successful = document.execCommand('copy');
    } catch( e ) {

    }
    $el.remove();
    return successful;
}


jQuery( document ).ready(function( $ ) {
	"use strict";

	var html = $('html');

    if ( ! is_support_copy_command() ){
        $("body").addClass( 'no-copy-cmd' );
    }
    // Video
    $("body").fitVids();

	// IE<8 Warning
	if (html.hasClass("ie6") || html.hasClass("ie7")) {
		$("body").empty().html('UPDATE YOUR BROWSER');
	}

    function openLoginModal(){
        $('.wpu-login-btn').trigger('click');
    }

    // New letter input
    function fix_newsletter_input_width(){
        $( '.newsletter-box-wrapper').each( function(){
            var form = $( this).find( 'form' );
            var w = form.width();
            var btn = form.find( '.submit-btn');
            var input = form.find( '.submit-input');
            var bw = btn.outerWidth();
            var iw = w - bw - parseFloat( input.css( 'padding-left' ) ) - parseFloat( input.css( 'padding-right' ) );
            input.width( iw );
        } );
    }
    fix_newsletter_input_width();
    $( window).resize( function(){
        fix_newsletter_input_width();
    } );

    // Toggle More/less coupon content
    $('body').on( 'click', '.coupon-item .more, .coupon-item .less', function( e ){
        e.preventDefault();
        var more = $( this );
        var p = more.closest( '.coupon-item' );
        p.toggleClass('show-full');
    } );


    // Ajax load more coupons
    $( '.ajax-coupons').each( function(){
        var p = $( this );

        $( '.load-more', p ).on( 'click', function() {
            var more = $( this);
            //var p = more.parents( '.ajax-coupons' );
            var btn = more.find('.button');

            if ( btn.hasClass('loading') ) {
                return false;
            }
            btn.addClass('loading');

            var link = btn.data('link');
            var cat_id = btn.data('cat-id');
            var next_page = btn.attr( 'data-next-page' );
            var text = btn.html();
            var loading= btn.data('loading-text');
            if ( loading !== '' ) {
                btn.html( loading );
            }

            var _doing = btn.data( 'doing' ) || '';
            if ( typeof _doing === "undefined" || _doing === '' ){
                _doing = 'load_coupons'
            }

            if ( typeof cat_id !== "undefined" && cat_id != '' ) {
                _doing = 'load_category_coupons';
            }

            if ( typeof link === "undefined" || link != '' ) {
                link = btn.attr('href');
            }

            var args = btn.data( 'args' );

            $.ajax( {
                data: {
                    action: 'wpcoupon_coupon_ajax',
                    'st_doing': _doing,
                    'current_link': link,
                    'cat_id': cat_id,
                    'next_page': next_page,
                    '_wpnonce': ST._wpnonce,
                    'args': args
                },
                type: 'post',
                url: ST.ajax_url,
                dataType: 'json',
                cache: false,
                success: function( response ){
                    btn.removeClass('loading');
                    btn.html( text );
                    var content = $( response.data.content );
                    $( '.st-list-coupons', p ).append( content );
                    $( '.coupon-des', content ).removeClass( 'show-full' );
                    btn.attr('data-next-page', response.data.next_page );
                    if ( response.data.next_page > 0 ) {
                    } else {
                        more.remove();
                    }
                    listingCouponItem( content );
                    voteCouponInit( content );
                }
            } );
            return false;
        } );


    } );


	// Coupon Filter -Tabs
	( function() {

        $( '.filter-coupons-by-type').each( function() {
            var filter_tabs =  $( this );
            var target = filter_tabs.data( 'target' );
            var p;
            try {
                if ( target !== '' ) {
                    p =  $( target );
                } else {
                    var p = $( '.store-listings' );
                }
            } catch ( e ) {
                var p = $( '.store-listings' );
            }

            $('a', filter_tabs ).click( function() {

                $('a', filter_tabs ).removeClass('active');

                var btn = $(this);
                btn.addClass('active');
                var filter = btn.data('filter') || '';
                if ( filter !== '' ) {
                    if ( filter == 'all' ) {
                       // $( '.section-heading, .load-more', p).show();
                        $( '.store-listing-item', p).removeAttr( 'style' );
                        p.find( '.load-more').show();
                    } else {
                       // $( '.section-heading, .load-more', p).hide();
                        $( '.store-listing-item', p).not( $( '.c-type-'+filter, p) ).css( { 'display' :'none' } );
                        $( '.store-listing-item.c-type-'+filter, p).css( { 'display' :'block' } );
                        p.find( '.load-more').hide();
                    }
                }
            });

        } );


        // Filter by tabs
        $( '.filter-coupons-by-tab').each( function(){

            var tabs = $( this );
            var target = tabs.data( 'target' ) || '';
            if ( target == '' ) {
                return  false;
            }

            var wrapper = $( target );

            $('a', tabs ).click( function() {

                $('a', tabs ).removeClass('active');

                var btn = $(this);
                btn.addClass('active');
                var filter = btn.data('filter') || '';
                if ( filter !== '' ) {
                    $( '.coupon-tab-content', wrapper).addClass( 'hide').removeClass('active');
                    $( '.coupon-tab-content'+filter).removeClass( 'hide').addClass('active');
                }
            });

        } );

        $( '.filter-coupons-by-tab a').eq( 0 ).trigger( 'click' );

	} )();

    // Vote coupon
    $( 'body' ).on( 'click', '.coupon-vote', function ( e ) {
        e.preventDefault();
        var btn = $( this);
        var p = btn.parent();
        // if is this coupon is already voted
        if ( p.hasClass('voted') ) {
            return false;
        }
        var coupon_id =  btn.data('coupon-id') || undefined;
        var type =  btn.data('vote-type') || 'up';
        if ( typeof coupon_id === "undefined" ) {
            return false;
        }

        btn.addClass('active');
        p.addClass('voted');
        setCookie('c_vote_id_'+coupon_id, type, ST.vote_expires );
        $.ajax( {
            data: { action: 'wpcoupon_coupon_ajax', 'st_doing': 'vote_coupon', vote_type: type , 'coupon_id' : coupon_id, '_wpnonce': ST._wpnonce },
            type: 'post',
            url: ST.ajax_url,
            dataType: 'json',
            success: function( response ){
                // coupon-vote
                try {
                    $( '.ajax-favorite-stores-box' ).html( response.data );
                } catch ( e ) {

                }
                $( 'body').trigger( 'st_coupon_favorite_stores_changed' );

            }
        } );
    } );


    /**
     * Active voted coupon
     */
    function voteCouponInit( context ){
        if (  typeof context === undefined ) {
            context = $( 'body' );
        }
        $( '.coupon-vote' , context ).each( function () {
            var btn = $( this );
            var coupon_id =  btn.data('coupon-id') || undefined;
            var type =  btn.data('vote-type') || 'up';
            if ( typeof coupon_id == "undefined" ) {
                return;
            }

            var c_vote = getCookie( 'c_vote_id_'+coupon_id );
            if (  c_vote ==  type ) {
                btn.addClass('active');
                btn.parent().addClass('voted');
            }

        } );
    }
    voteCouponInit();

    // Print coupon image
    $( 'body' ).on( 'click', '.btn-print-coupon', function( e ){
        e.preventDefault();
        var img = $( this).attr( 'href' );

        var print_modal = window.open( img ,"" );
        print_modal.focus();
        print_modal.onload = function () { print_modal.print();}

    } );


    /**
     *  Open Modal on load
     */
    function openCouponModal( coupon_id ){
        if (  typeof coupon_id === "undefined" || coupon_id < 0 ) {
            coupon_id = string_to_number(ST.share_id);
            if (coupon_id <= 0) {
                if (  ST.coupon_id  ) {
                    coupon_id = string_to_number( ST.coupon_id );
                }
            }
        }

        if ( coupon_id > 0 ) {

            if ( coupon_id && $( '.coupon-modal[data-modal-id="'+coupon_id+'"]' ).length > 0 ) {
                $( '.coupon-modal[data-modal-id="'+coupon_id+'"]' ).hide();
                var $context =  $( '.coupon-modal[data-modal-id="'+coupon_id+'"]').eq( 0 );
                if ( ! is_support_copy_command() ) {
                    $context.find( '.modal-code .coupon-code .ui').removeClass( 'action' ).find( '.button').remove();
                }

                $context.modal({
                    selector: {
                        close: '.close, .cancel',
                    },
                    onVisible: function(){

                    },

                }).modal('show');

            } else if ( coupon_id > 0 ) {
                if ( window[ 'opening_coupon_' + coupon_id ] ) {
                    return false;
                }
                window[ 'opening_coupon_' + coupon_id ] = true;
                $.ajax( {
                    data: { action: 'wpcoupon_coupon_ajax', 'st_doing': 'get_coupon_modal', 'hash' : coupon_id, '_wpnonce': ST._wpnonce },
                    type: 'post',
                    url: ST.ajax_url,
                    dataType: 'json',
                    error: function(){
                        delete  window[ 'opening_coupon_' + coupon_id ];
                    },
                    success: function( response ){
                        var content =  $( response.data );
                        delete  window[ 'opening_coupon_' + coupon_id ];

                        $( 'body').append( content ) ;
                        var $context =  $( '[data-modal-id="'+coupon_id+'"]');
                        if ( ! is_support_copy_command() ) {
                            $context.find( '.modal-code .coupon-code .ui').removeClass( 'action' ).find( '.button').remove();
                        }
                        if ( $context.hasClass('coupon-modal') ) {
                            couponModalDetails( );
                            voteCouponInit( content );
                            $context.modal({
                                selector: {
                                    close: '.close, .cancel',
                                },
                                onVisible: function(){

                                },
                            }).modal('show');

                        }
                    }
                } );
            }
        }// end if has hash
    }

    if ( ST.auto_open_coupon_modal && typeof ST.current_coupon_id !== "undefined" ) {
        openCouponModal( ST.current_coupon_id );
    } else {
        openCouponModal();
    }

    $( window ).on( 'let_open_coupon_modal', function(){
        openCouponModal( );
    } );

    // when click to coupon link
    $( 'body' ) .on( 'click', '.coupon-button-type .coupon-button, .coupon-title a.coupon-link, .coupon-link', function ( e ) {
        e.preventDefault();

        var current_url, coupon_id, aff_url, t;

        if ( ST.enable_single == 1 && $( this).hasClass( 'coupon-button' ) ) {
            coupon_id = $(this).data('coupon-id') || undefined;
            aff_url = $(this).attr('data-aff-url');
            current_url = $( this ).attr( 'href' );
            if ( ST.current_coupon_id == coupon_id ) {
                openCouponModal( ST.current_coupon_id );
            } else {
                t = $(this).attr('data-type') || '';
                if (
                    ( t == 'print' && ST.print_prev_tab != 1 )
                    || ( t == 'code' && ST.code_prev_tab != 1 )
                    || ( t == 'sale' && ST.sale_prev_tab != 1 )
                ) {
                    window.open( current_url, '_self');
                } else {
                    window.open( aff_url, '_self');
                    window.open( current_url, '_blank');
                }

            }
            return false;

        } else if ( ST.enable_single == 1 && $(e.target).hasClass( 'coupon-link' ) ) {
            current_url = $( this ).attr( 'href' );
            window.open( current_url, '_self' );
        } else {
            coupon_id = $(this).data('coupon-id') || undefined;

            if ( typeof coupon_id == "undefined") {
                return false;
            }

            // Copy code to clipboard
            var code = $(this).attr('data-code') || '';
            if (code && code != '') {
                copyText(code);
            }

            t = $(this).attr('data-type') || '';
            if (
                ( t == 'print' && ST.print_prev_tab != 1 )
                || ( t == 'code' && ST.code_prev_tab != 1 )
                || ( t == 'sale' && ST.sale_prev_tab != 1 )
            ) {
                openCouponModal( coupon_id );
            } else {
                aff_url = $(this).attr('data-aff-url');
                current_url = $(this).attr('href');
                window.open( aff_url, '_self');
                window.open( current_url, '_blank');
                return false;
            }
        }
    } );


    // Listing Item
	function listingCouponItem( context ) {

        if ( typeof context === "undefined" ) {
            context = $( 'body' );
        }

        // remove tooltip copy if not support
        if ( ! is_support_copy_command() ) {
            $( '.coupon-button-type .coupon-button', context).removeAttr( 'data-tooltip' );
        }


        var store_listing_item;
        if ( $( '.store-listing-item', context).length > 0 ){
             store_listing_item = $( '.store-listing-item', context );
        } else {
             store_listing_item = context;
        }

        if ( typeof store_listing_item == 'undefined' ) {
            return false;
        }
        if ( store_listing_item.length == 0 ) {
            return false;
        }

		store_listing_item.each( function(){
			// Open Modal
			var coupon_modal = $(this).find('.coupon-modal');

			// Reveal box
			var reveal_link = $(this).find('.coupon-footer li a');
			var reveal_content = $(this).find('.reveal-content');
			reveal_link.each( function() {
				$(this).click( function(){

					reveal_link.removeClass('active');
					$(this).addClass('active');
					//$(this).toggleClass('active');

					var reveal_link_data = $(this).attr('data-reveal');
					reveal_content.each( function() {
						if( $(this).hasClass(reveal_link_data) ) {
							reveal_content.removeClass('active');
							$(this).addClass('active');
							
							$(this).find('.close').click( function() {
								$(this).parent().removeClass('active');
								reveal_link.removeClass('active');
							});

                            $(this).trigger('reveal_content_open', [ reveal_link_data ] );
						}
					});
					return false;
				});
			} );

            // when reveal_content open
            $('.reveal-content', $(this) ).on( 'reveal_content_open' , function ( $el , $item ) {
                var obj = $( this );
                if ( obj.hasClass( 'reveal-comments' ) && !obj.hasClass('comments-loaded')) {
                    obj.addClass('comments-loaded');
                    get_coupon_comments( obj );
                }
            } );

            function get_coupon_comments( $el ) {
                var coupon_id = $el.data( 'coupon-id' );
                var area =  $('.comments-coupon-'+coupon_id );

                $.ajax( {
                    data: { action: 'wpcoupon_coupon_ajax', 'st_doing': 'get_coupon_comments',  'coupon_id' : coupon_id, '_wpnonce': ST._wpnonce },
                    type: 'get',
                    url: ST.ajax_url,
                    dataType: 'json',
                    success: function( response ){
                        area.html( response.data );
                        area.trigger('comments_loaded');
                    }
                } );

                area.on( 'comments_loaded' , function(){
                    // Ajax load more commment
                    $('.load-more-btn', area ).bind( 'click', function(){
                        var btn = $( this );
                        var c_paged =  $( this).data('c-paged');
                        $.ajax( {
                            data: { action: 'wpcoupon_coupon_ajax', 'st_doing': 'get_coupon_comments',  'coupon_id' : coupon_id, c_paged : c_paged, '_wpnonce': ST._wpnonce },
                            type: 'get',
                            url: ST.ajax_url,
                            dataType: 'json',
                            success: function ( response ) {
                                btn.parent().remove();
                                area.append( response.data );
                                area.trigger( 'comments_loaded' );
                            }
                        } );

                        return false;
                    } );
                    // END load more comments
                } );
            }// end  get_coupon_comments

            // send mail to friend

            $( '.reveal-email', $(this) ).each( function() {
                var f = $( this );

                $( 'input', f ).focus( function() {
                    $( this ).parent().removeClass('error');
                } );

                $( '.email_send_btn', f).click( function() {

                    var coupon_id = f.data('coupon-id') || '';
                    if ( coupon_id == '' ) {
                        return false;
                    }

                    var email = $( 'input.email_send_to', f).val() || '';
                    if ( ! isEmail( email ) ) {
                        $( '.input', f ).addClass( 'error' );
                        return false;
                    }
                    // send to server
                    $.ajax( {
                        data: { action: 'wpcoupon_coupon_ajax', 'st_doing': 'send_mail_to_friend', email: email, 'coupon_id' : coupon_id, '_wpnonce': ST._wpnonce },
                        type: 'post',
                        url: ST.ajax_url,
                        dataType: 'json',
                        success: function ( response ) {
                            $( '.email_send_to', f ).val('');
                            $( '.send-mail-heading',  f).text( response.data );
                        }
                    } );

                } );
            } );

            // END send mail to friend
		});

        $('form.coupon-comment-form  input, form.coupon-comment-form  textarea').focus( function() {
            $( this ).parent().removeClass('error');
        } );

        // Submit comment form
        $( 'form.coupon-comment-form', context ).submit( function() {

            var f = $( this );
            var data = f.serialize();

            // validate form
            var c = $('textarea.comment_content',f ).val();
            var n = $('input.comment_author',f).val() || false;
            var e = $('input.comment_author_email',f).val() || false;
            var is_error = false;
            if ( c.length < 3 ) {
                $('.field.comment_content', f ).addClass('error');
                is_error = true;
            }

            if ( n !== false ) {
                if (n.length < 3) {
                    $('.field.comment_author', f).addClass('error');
                    is_error = true;
                }
            }

            if ( e !== false ) {
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                if (e.length < 3 || !re.test( e ) ) {
                    $('.field.comment_author_email', f).addClass('error');
                    is_error = true;
                }
            }


            if ( ! is_error ) {
                $.ajax({
                    data: data,
                    type: 'post',
                    url: ST.ajax_url,
                    dataType: 'html',
                    success: function ( response ) {
                        var r;
                        try {
                            r = JSON.parse(response);
                        } catch (e) {
                            r = response;
                        }

                        if ( typeof r == "string" ){
                             $( '.success.message', f).hide();
                             $( '.negative.message', f).show().html( r );
                        } else {
                             $('textarea.comment_content',f).val('');

                             if ( r.success === true || r.success === 'true' ) {
                                 $( '.success.message', f).show().html(r.data );
                                 $( '.negative.message', f).hide();
                             } else {
                                 $( '.success.message', f).hide().html( r.data  );
                                 $( '.negative.message', f).show();
                             }
                        }
                    }
                });
            }
            return false;
        } );
        // END Submit comment form

        // Save coupon
        $( '.coupon-save', context ).each( function () {

            var btn = $( this );
            var id = btn.data( 'coupon-id' );

            var icon ='star', empty_icon = 'empty', loading_icon = 'spinner';

            var child = btn;
            if ( btn.find( '.icon').length > 0 ) {
                child =  btn.find( '.icon');
            }

            try {

                if ( id > 0 && ST.my_saved_coupons.indexOf( id.toString() ) > -1 ){

                    child.removeClass('empty loading').removeClass( loading_icon ).addClass( icon );
                    btn.addClass('active added');
                    btn.attr('data-tooltip',ST.saved_coupon );

                } else {

                }

            } catch ( e ) {

            }

            btn.click( function(){

                if ( ST.user_logedin != 1 ) {
                    //alert( ST.login_warning );
                    // remove modal if is opening
                    $( '.ui.modals, ui modal').removeClass( 'visible active').addClass( 'hidden' );
                    openLoginModal();
                    return false;
                }

                // ajax add store to favorite
                if ( btn.hasClass('disabled') ) {
                    return false;
                }

                var action = 'save_coupon';

                if (  btn.hasClass('added') ) {
                    action = 'remove_saved_coupon';
                }

                child.addClass('loading').removeClass( icon).addClass( loading_icon );

                $.ajax( {
                    data: { action: 'wpcoupon_coupon_ajax', 'st_doing': action , 'id' : id, '_wpnonce': ST._wpnonce },
                    type: 'post',
                    url: ST.ajax_url,
                    dataType: 'json',
                    success: function( response ){
                        if ( action == 'save_coupon' ) {
                            child.removeClass('empty loading').removeClass( loading_icon ).addClass( icon );
                            btn.addClass('active added');
                            btn.attr( 'data-tooltip', ST.saved_coupon );
                        } else {
                            child.addClass('empty').removeClass( loading_icon).removeClass('loading').addClass( icon );
                            btn.removeClass('active added');
                             btn.attr( 'data-tooltip', ST.save_coupon );
                        }

                        btn.removeClass( 'disabled' );

                        try {
                            $( '.ajax-saved-coupon-box' ).html( response.data );
                            listingCouponItem( $( '.ajax-saved-coupon-box' ) );

                        } catch ( e ) {

                        }

                        // Trigger event handle
                        $( 'body').trigger( 'st_coupon_saved_coupons_changed' );
                    }
                } );

                return false;

            } );
        } );

        // END save coupon

	} // END function listingCouponItem
    listingCouponItem();


	// Initializing Form Elements
	function InitializingFormElements() {
		$('.dropdown').dropdown();
		$('.ui.checkbox').checkbox();
	}
    InitializingFormElements();


	// Initializing Search Loading

    window._search_xhr = null;
    window._search_timeOut = null;

    function ajax_search_coupons( val , f ){
        window._search_xhr = $.ajax( {
            //url: ST.ajax_url,
            url: ST.home_url,
            cache: false,
            data: {
                ajax_sc: val,
                //action: 'wpcoupon_coupon_ajax_search',
            },
            type: 'GET',
            dataType: 'json',
            success: function ( response ) {
                f.removeClass( 'loading' );
                var r, w;
                if ( f.find( '.results').length > 0 ) {

                } else {
                    f.append( '<div class="results"></div>' );
                }

                r =  f.find( '.results');
                var html = '';
                if ( response.results.length > 0 ) {
                    $( response.results ).each( function( index, result ){
                        html+=  '<div class="result">' +
                            '<a href="' + result.url + '"></a>' +
                            '<div class="image">'+result.image+'</div>'+
                            '<div class="content">' +
                            '<div class="title">'+result.title+'</div>' +
                            //'<div class="description">'+result.description+'</div>' +
                            '</div>' +
                            '</div>';
                    } );

                    if ( html !== '' ) {
                        w =  f.outerWidth();
                        if( typeof response.action !== "undefined" ) {
                            html+='<a class="action" href="'+response.action.url+'">'+response.action.text+'</a>'
                        }
                        r.html(html);
                        r.css( { 'width': w+'px' } ).addClass('items ui transition visible');
                    }

                } else if ( val !== '' ){

                    r.removeClass('items ui transition visible');
                    /*

                    html+=  '<div class="result not-found">' +
                        '<div class="content">' +
                        '<div class="title">'+ST.no_results+'</div>' +
                        '</div>' +
                        '</div>';

                    w =  f.outerWidth();
                    r.html(html);
                    r.css( { 'width': w+'px' } ).addClass('items ui transition visible');
                    */

                } else {
                    r.removeClass('items ui transition visible');
                }

            }
        } );
    }

    // Submit search form when click button
    $( 'form#header-search .button').click( function(){
        var f =   $( this ).closest('form');
        var val = $( 'input[name="s"]', f ).val();
        if ( val && val.trim() != '' ) {

            if ( window._search_xhr ) {
                window._search_xhr.abort();
                window._search_xhr = null;
            }

            ajax_search_coupons( val, f );
        }
    } );

    $( '.header-search-input .prompt' ).on( 'keyup', function( e ) {
        var input = $( this );
        var val = input.val();
        var f =  input.parent();
        if ( window._search_xhr ) {
            window._search_xhr.abort();
            window._search_xhr = null;
        }

        if ( val && val.trim() != '' ) {
            f.addClass( 'loading' );
            ajax_search_coupons( val, f );
        } else {
            f.removeClass( 'loading' );
            f.find( '.results').hide().removeClass( 'visible' ).removeAttr( 'style' );
        }

    } );



	// Show coupon detail on modal
	function couponModalDetails(  ) {
		$( '.coupon-modal' ).each( function() {
			var coupon_popup_detail = $(this).find('.coupon-popup-detail');
			var show_detail = $(this).find('.show-detail a');
			coupon_popup_detail.hide();
			
			$(show_detail).click( function() {
				if ( $(show_detail).hasClass('show-detail-on') ) {
					coupon_popup_detail.hide();
					$(this).removeClass('show-detail-on');
					$(this).find('i').removeClass('up').addClass('down');
				} else {
					coupon_popup_detail.show();
					$(this).addClass('show-detail-on');
					$(this).find('i').removeClass('down').addClass('up');
				}
				return false;
			} );

		} );
	}
    couponModalDetails();

	// Add to favorite
	( function() {

        // add Store to favorite
        $('.add-favorite').each( function(){

            var btn = $( this );
            var id = btn.data( 'id' );
            var icon ='heart', empty_icon = 'empty', loading_icon = 'spinner';

            try {

                if ( id > 0 && ST.my_favorite_stores.indexOf( id.toString() ) > -1 ){
                    btn.find('.icon').removeClass('empty loading').removeClass( loading_icon ).addClass( icon );
                    btn.addClass('added');

                    btn.find('span').html( ST.added_favorite );

                    if ( btn.hasClass( 'icon-popup' ) ) {
                        btn.attr( 'title', ST.added_favorite );
                    }

                } else {

                    if ( btn.hasClass( 'icon-popup' ) ) {
                        btn.attr( 'title', ST.add_favorite );
                    }

                }

            } catch ( e ) {

            }

            btn.click( function() {
                if ( ST.user_logedin != 1 ) {
                    //alert( ST.login_warning );
                    openLoginModal();
                    return false;
                }

                // ajax add store to favorite
                if ( btn.hasClass('disabled') ) {
                    return false;
                }

                btn.addClass( 'disabled' );
                var action = 'add_favorite';
                if (  btn.hasClass('added') ) {
                    action = 'delete_favorite';
                }

                btn.find( '.icon').addClass('loading').removeClass( icon).addClass( loading_icon );

                $.ajax( {
                    data: { action: 'wpcoupon_coupon_ajax', 'st_doing': action , 'id' : id, '_wpnonce': ST._wpnonce },
                    type: 'post',
                    url: ST.ajax_url,
                    dataType: 'json',
                    success: function( response ){
                        if ( action == 'add_favorite' ) {
                            btn.find('.icon').removeClass('empty loading').removeClass( loading_icon ).addClass( icon );
                            btn.addClass('added');
                            btn.find('span').html( ST.added_favorite );
                            if ( btn.hasClass( 'icon-popup' ) ) {
                                btn.attr( 'title', ST.added_favorite );
                            }
                        } else {
                            btn.find('.icon').addClass('empty').removeClass( loading_icon).removeClass('loading').addClass( icon );
                            btn.removeClass('added');
                            btn.find('span').html( ST.add_favorite );

                            if ( btn.hasClass( 'icon-popup' ) ) {
                                btn.attr( 'title', ST.add_favorite );
                            }
                        }

                        btn.removeClass( 'disabled' );

                        try {
                            $( '.ajax-favorite-stores-box' ).html( response.data );
                        } catch ( e ) {

                        }
                        $( 'body').trigger( 'st_coupon_favorite_stores_changed' );
                    }
                } );
                return false;
            });

        } );

	} )();

    // auto close message
    $('.message .close').on('click', function() {
        $(this).closest('.message').transition('fade');
    });



    // When click copy on modal
    $( 'body').on( 'click',  '.modal-code .coupon-code .button', function( e ){
        e.preventDefault();
        var btn = $( this);
        var  p = btn.closest( '.coupon-code' );
        var code = p.find( 'input.code-text').val();
        if ( code ) {
            if ( copyText( code ) ) {
                btn.find( 'span' ) .html( ST.copied );
                setTimeout( function(){
                    btn.find( 'span' ) .html( ST.copy );
                }, 3000 );
            } else {

            }
        }
    } );


    // Content Toggle
    $( '.content-toggle').on( 'click', '.show-more', function( e ){
        e.preventDefault();
        $( this ).hide( );
        $( '.content-more', $( this).parent()).slideDown( 400 );
    } );

    // Superfish Menu Toggle
    var mobileBreakPoint = 790;
    var navMenu = $('.primary-navigation .st-menu');

    $( '.menu-item-has-children').append( '<div class="nav-toggle-subarrow"><i class="plus icon"></i></div>' );
    $('#nav-toggle').click(function () {
        navMenu.toggleClass("st-menu-mobile");
    });

    $('.nav-toggle-subarrow, .nav-toggle-subarrow .nav-toggle-subarrow').click(function () {
        $(this).parent().toggleClass("nav-toggle-dropdown");
    });

    $( window ).resize( function(){
        var w = $( window ).width();
        if ( navMenu.hasClass( 'st-menu-mobile' ) ) {
            if ( w > mobileBreakPoint ) {
                navMenu.removeClass("st-menu-mobile");
            }
        }
    } );

    ST.header_sticky = string_to_number( ST.header_sticky );
    if ( ST.header_sticky ) {
        // Header sticky
        var headerNav = $('#site-header-nav');
        headerNav.wrap('<div id="site-header-nav-wrapper"></div>');
        var headerNavWrapper = $('#site-header-nav-wrapper');
        headerNavWrapper.css({height: headerNav.height(), display: 'block'});
        $( window).resize( function(){
            headerNavWrapper.css({height: headerNav.height(), display: 'block'});
        } );
        var navTop = headerNavWrapper.offset().top;

        $(document).scroll(function () {
            var top = $(document).scrollTop();
            var adminbarH = 0;
            var is_fixed_admin_bar = false;
            var w = $( window).width();
            if ( w > mobileBreakPoint ) {

                if ($('#wpadminbar').length > 0) {
                    adminbarH = $('#wpadminbar').height();
                    is_fixed_admin_bar = ( $('#wpadminbar').css('position') === 'fixed' ) ? true : false;
                }

                if (top > navTop - adminbarH) {
                    $('body').addClass('sticky-header');
                    headerNav.css({position: 'fixed', top: ( is_fixed_admin_bar ) ? adminbarH : 0, left: 0, right: 0, width: '100%'});
                } else {
                    $('body').removeClass('sticky-header');
                    headerNav.css({position: 'inherit', top: 'auto', left: 'auto', right: 'auto', width: '100%'})
                }
            } else {
                headerNav.css({position: 'inherit', top: 'auto', left: 'auto', right: 'auto', width: '100%'})
            }
        });
    }


});

jQuery(document).mouseup(function (e){
	var $ = jQuery;
    var container = $(".reveal-content");
    if (!container.is(e.target) && container.has(e.target).length === 0){
        container.removeClass('active');
        $('.coupon-footer li a').removeClass('active');
    }
});


