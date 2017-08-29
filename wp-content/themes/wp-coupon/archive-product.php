<?php
/**
* @see 	    http://docs.woothemes.com/document/template-structure/
 * @author 		WooThemes
* @package 	WooCommerce/Templates
* @version     2.0.0
*/

get_header( 'shop' );

/**
* Hooks wpcoupon_after_header
* @see woocommerce_content
* @see wpcoupon_page_header();
*
*/
do_action( 'wpcoupon_after_header' );
$layout = wpcoupon_get_site_layout();
?>
<div id="content-wrap" class="container wc-archive-container <?php echo esc_attr( $layout ); ?>">
    <div id="primary" class="content-area">
        <main id="main" class="site-main" role="main">
            <?php
            /**
             * woocommerce_before_main_content hook.
             *
             * @hooked woocommerce_output_content_wrapper - 10 (outputs opening divs for the content)
             * @hooked woocommerce_breadcrumb - 20
             */
            do_action( 'woocommerce_before_main_content' );

            /**
             * woocommerce_archive_description hook.
             *
             * @hooked woocommerce_taxonomy_archive_description - 10
             * @hooked woocommerce_product_archive_description - 10
             */
            do_action( 'woocommerce_archive_description' );
            ?>

            <?php if ( have_posts() ) : ?>

                <?php
                /**
                 * woocommerce_before_shop_loop hook.
                 *
                 * @hooked woocommerce_result_count - 20
                 * @hooked woocommerce_catalog_ordering - 30
                 */
                do_action( 'woocommerce_before_shop_loop' );
                ?>

                <?php woocommerce_product_loop_start(); ?>

                <?php woocommerce_product_subcategories(); ?>

                <?php while ( have_posts() ) : the_post(); ?>

                    <?php wc_get_template_part( 'content', 'product' ); ?>

                <?php endwhile; // end of the loop. ?>

                <?php woocommerce_product_loop_end(); ?>

                <?php
                /**
                 * woocommerce_after_shop_loop hook.
                 *
                 * @hooked woocommerce_pagination - 10
                 */
                do_action( 'woocommerce_after_shop_loop' );
                ?>

            <?php elseif ( ! woocommerce_product_subcategories( array( 'before' => woocommerce_product_loop_start( false ), 'after' => woocommerce_product_loop_end( false ) ) ) ) : ?>

                <?php wc_get_template( 'loop/no-products-found.php' ); ?>

            <?php endif; ?>

            <?php
            /**
             * woocommerce_after_main_content hook.
             *
             * @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for the content)
             */
            do_action( 'woocommerce_after_main_content' );
            ?>
        </main><!-- #main -->
    </div><!-- #primary -->

    <?php

    if ( $layout != 'no-sidebar' ) {
        ?>
        <div id="secondary" class="widget-area sidebar" role="complementary">
            <?php dynamic_sidebar( 'sidebar-woo' ); ?>
        </div><!-- #secondary -->
        <?php
    }

    ?>
</div> <!-- /#content-wrap -->

<?php get_footer( 'shop' ); ?>
