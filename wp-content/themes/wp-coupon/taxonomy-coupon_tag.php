<?php
get_header();
$cate_title = single_cat_title( '', false );
$cate_id =  get_queried_object_id();

$layout = wpcoupon_get_option( 'coupon_cate_layout', 'right-sidebar' );
?>

<div id="content-wrap" class="container <?php echo esc_attr( $layout ); ?>">

    <div id="primary" class="content-area">
        <main id="main" class="site-main ajax-coupons" role="main">
            <section id="store-listings-wrapper" class="st-list-coupons wpb_content_element">
                <?php the_archive_title( '<h2 class="section-heading">', '</h2>' ); ?>
                <?php
                global $wp_rewrite, $post;
                $tpl = wpcoupon_get_option( 'coupon_cate_tpl', 'cat' );

                if ( have_posts() ) {
                   while( have_posts() ) {
                       the_post();
                       wpcoupon_setup_coupon( $post );
                       get_template_part('loop/loop-coupon', $tpl);
                   }
                }

                ?>
            </section>
            <?php
            get_template_part( 'content', 'paging' );
            ?>
        </main><!-- #main -->
    </div><!-- #primary -->

    <div id="secondary" class="widget-area sidebar" role="complementary">
        <?php
        dynamic_sidebar( 'sidebar-coupon-category' );
        ?>
    </div>

    <?php
    $ads = wpcoupon_get_option( 'coupon_cate_ads', '' );
    if ( $ads ) {
        echo '<div class="clear"></div>';
        echo balanceTags( $ads );
    }
    ?>

</div> <!-- /#content-wrap -->

<?php
get_footer();
?>
