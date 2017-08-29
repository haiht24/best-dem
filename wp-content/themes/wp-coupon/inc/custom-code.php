<?php




/**
 * Output Custom CSS to wp_head hook.
 */
function wpcoupon_theme_custom_css() {
    $styles     = null;
    $custom_css = wpcoupon_get_option('site_css');

    if ( $custom_css !== '' ) $styles .= $custom_css;

    $css_output = "\n<style id=\"theme_option_custom_css\" type=\"text/css\">\n" . preg_replace( '/\s+/', ' ', $styles ) . "\n</style>\n";

    if ( !empty( $custom_css ) ) echo $css_output;
}
add_action( 'wp_head', 'wpcoupon_theme_custom_css' );


/**
 * Output Header Tracking Code to wp_head hook.
 */
function wpcoupon_theme_header_code() {
    $site_header_tracking = wpcoupon_get_option('site_header_tracking');
    if ( $site_header_tracking !== '' ) echo $site_header_tracking;
}
add_action( 'wp_head', 'wpcoupon_theme_header_code' );

/**
 * Output Footer Tracking Code to wp_footer hook.
 */
function wpcoupon_theme_footer_code() {
    $site_footer_tracking = wpcoupon_get_option('site_footer_tracking');
    if ( $site_footer_tracking !== '' ) echo $site_footer_tracking;
}
add_action( 'wp_footer', 'wpcoupon_theme_footer_code' );