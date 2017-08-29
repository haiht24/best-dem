<?php
class  WPCoupon_Search{

    function __construct() {
        add_action( 'pre_get_posts', array( $this, 'init' ) );
    }

    function init(){
        if ( is_search() && ! is_admin() ) {
            if (  wpcoupon_get_option( 'search_only_coupons', 1 ) ) {
                set_query_var( 'post_type', 'coupon' );
            }
        }

        if ( is_search() || ( isset( $_REQUEST['c_s_store'] ) && $_REQUEST['c_s_store'] != '' ) ) {
            add_filter('posts_where', array($this, 'where'));
            add_filter('posts_join', array($this, 'join'));
            add_filter('posts_groupby', array($this, 'groupby'));
            if ( ! is_admin() ) {
                add_filter('posts_orderby', array($this, 'orderby'));
                add_filter('posts_distinct',  array( $this, 'distinct' ) );
            }
        }
    }

    function where($where){
        global $wpdb;
        $s = '';
        $op = 'OR';
        if ( is_admin() ) {
            if ( isset( $_REQUEST['c_s_store'] ) && $_REQUEST['c_s_store'] != '') {
                $s = esc_sql( $_REQUEST['c_s_store'] );
                $op = 'AND';
            }
        } else {
            $s = esc_sql( get_search_query() );
        }
        $s = trim( $s );
        if ( $s ) {
            $where .= "{$op} (t.name LIKE '%".$s. "%' AND tt.taxonomy = 'coupon_store' AND {$wpdb->posts}.post_status = 'publish' )";
        }

        return $where;
    }

    function join($join){
        global $wpdb;

        $join = "LEFT JOIN {$wpdb->term_relationships} tr ON {$wpdb->posts}.ID = tr.object_id
        LEFT JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id=tr.term_taxonomy_id
        LEFT JOIN {$wpdb->terms} t ON t.term_id = tt.term_id";

        return $join;
    }

    function groupby($groupby){
        global $wpdb;

        $groupby = "{$wpdb->posts}.ID";

        return $groupby;
    }

    function orderby( $orderby ){
        global $wpdb;
        $orderby = " t.name ASC, {$wpdb->posts}.post_title ";
        return $orderby;
    }

    function distinct( $distinct ){
        return $distinct;
    }


}

new WPCoupon_Search();




