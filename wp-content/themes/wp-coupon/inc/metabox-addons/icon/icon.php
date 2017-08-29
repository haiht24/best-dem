<?php


if ( is_admin()  ){
    add_action( 'admin_print_styles-post.php', 'cmb2_render_icon_styles' );
    add_action( 'admin_print_styles-post-new.php', 'cmb2_render_icon_styles' );
    add_action( 'load-edit-tags.php', 'cmb2_render_icon_styles' );;

    add_action( 'admin_print_scripts-post-new.php', 'cmb2_render_icon_js' );
    add_action( 'admin_print_scripts-post.php', 'cmb2_render_icon_js' );
    add_action( 'load-edit-tags.php', 'cmb2_render_icon_js' );
}



/**
 * Load css for edit post
 */
function cmb2_render_icon_styles(){
    $url = get_template_directory_uri().'/inc/metabox-addons/icon/';
    wp_enqueue_style( 'semantic-icon', $url . 'icon.min.css' );
    wp_enqueue_style( 'cmb2-icon-type', $url . 'icon-admin.css' );
}

/**
 * Load js for edit post
 */
function cmb2_render_icon_js(){
    $url = get_template_directory_uri().'/inc/metabox-addons/icon/';
    wp_enqueue_script( 'cmb2-icon-type', $url . 'icon.js', array( 'jquery' ), 'true' );
    wp_localize_script( 'jquery', 'CMB2_ICON', array(
        'icons'=>  'alarm icon,alarm slash icon,alarm outline icon,alarm slash outline icon,at icon,browser icon,bug icon,calendar outline icon,calendar icon,cloud icon,code icon,comment icon,comments icon,comment outline icon,comments outline icon,copyright icon,dashboard icon,dropdown icon,external square icon,external icon,eyedropper icon,feed icon,find icon,heartbeat icon,history icon,home icon,idea icon,inbox icon,lab icon,mail icon,mail outline icon,mail square icon,map icon,options icon,paint brush icon,payment icon,phone icon,phone square icon,privacy icon,protect icon,search icon,setting icon,settings icon,shop icon,sidebar icon,signal icon,sitemap icon,tag icon,tags icon,tasks icon,terminal icon,text telephone icon,ticket icon,trophy icon,wifi icon,adjust icon,add user icon,add to cart icon,archive icon,ban icon,bookmark icon,call icon,call square icon,cloud download icon,cloud upload icon,compress icon,configure icon,download icon,edit icon,erase icon,exchange icon,external share icon,expand icon,filter icon,flag icon,flag outline icon,forward mail icon,hide icon,in cart icon,lock icon,pin icon,print icon,random icon,recycle icon,refresh icon,remove bookmark icon,remove user icon,repeat icon,reply all icon,reply icon,retweet icon,send icon,send outline icon,share alternate icon,share alternate square icon,share icon,share square icon,sign in icon,sign out icon,theme icon,translate icon,undo icon,unhide icon,unlock alternate icon,unlock icon,upload icon,wait icon,wizard icon,write icon,write square icon,announcement icon,birthday icon,flag icon,help icon,help circle icon,info icon,info circle icon,warning icon,warning circle icon,warning sign icon,child icon,doctor icon,handicap icon,spy icon,student icon,user icon,users icon,female icon,gay icon,heterosexual icon,intergender icon,lesbian icon,male icon,man icon,neuter icon,non binary transgender icon,transgender icon,other gender icon,other gender horizontal icon,other gender vertical icon,woman icon,grid layout icon,list layout icon,block layout icon,zoom icon,zoom out icon,resize vertical icon,resize horizontal icon,maximize icon,crop icon,anchor icon,bar icon,bomb icon,book icon,bullseye icon,calculator icon,checkered flag icon,cocktail icon,diamond icon,fax icon,fire extinguisher icon,fire icon,gift icon,leaf icon,legal icon,lemon icon,life ring icon,lightning icon,magnet icon,money icon,moon icon,plane icon,puzzle icon,rain icon,road icon,rocket icon,shipping icon,soccer icon,suitcase icon,sun icon,travel icon,treatment icon,world icon,asterisk icon,certificate icon,circle icon,circle notched icon,circle thin icon,crosshairs icon,cube icon,cubes icon,ellipsis horizontal icon,ellipsis vertical icon,quote left icon,quote right icon,spinner icon,square icon,square outline icon,add circle icon,add square icon,check circle icon,check circle outline icon,check square icon,checkmark box icon,checkmark icon,minus circle icon,minus icon,minus square icon,minus square outline icon,move icon,plus icon,plus square outline icon,radio icon,remove circle icon,remove circle outline icon,remove icon,selected radio icon,toggle off icon,toggle on icon,area chart icon,bar chart icon,camera retro icon,newspaper icon,film icon,line chart icon,photo icon,pie chart icon,sound icon,angle double down icon,angle double left icon,angle double right icon,angle double up icon,angle down icon,angle left icon,angle right icon,angle up icon,arrow circle down icon,arrow circle left icon,arrow circle outline down icon,arrow circle outline left icon,arrow circle outline right icon,arrow circle outline up icon,arrow circle right icon,arrow circle up icon,arrow down icon,arrow left icon,arrow right icon,arrow up icon,caret down icon,caret left icon,caret right icon,caret up icon,chevron circle down icon,chevron circle left icon,chevron circle right icon,chevron circle up icon,chevron down icon,chevron left icon,chevron right icon,chevron up icon,long arrow down icon,long arrow left icon,long arrow right icon,long arrow up icon,pointing down icon,pointing left icon,pointing right icon,pointing up icon,toggle down icon,toggle left icon,toggle right icon,toggle up icon,desktop icon,disk outline icon,file archive outline icon,file audio outline icon,file code outline icon,file excel outline icon,file icon,file image outline icon,file outline icon,file pdf outline icon,file powerpoint outline icon,file text icon,file text outline icon,file video outline icon,file word outline icon,folder icon,folder open icon,folder open outline icon,folder outline icon,game icon,keyboard icon,laptop icon,level down icon,level up icon,mobile icon,power icon,plug icon,tablet icon,trash icon,trash outline icon,barcode icon,css3 icon,database icon,fork icon,html5 icon,openid icon,qrcode icon,rss icon,rss square icon,server icon,empty heart icon,empty star icon,frown icon,heart icon,meh icon,smile icon,star half empty icon,star half icon,star icon,thumbs down icon,thumbs outline down icon,thumbs outline up icon,thumbs up icon,backward icon,eject icon,fast backward icon,fast forward icon,forward icon,music icon,mute icon,pause icon,play icon,record icon,step backward icon,step forward icon,stop icon,unmute icon,video play icon,video play outline icon,volume down icon,volume off icon,volume up icon,building icon,building outline icon,car icon,coffee icon,emergency icon,first aid icon,food icon,h icon,hospital icon,location arrow icon,marker icon,military icon,paw icon,space shuttle icon,spoon icon,taxi icon,tree icon,university icon,columns icon,sort alphabet ascending icon,sort alphabet descending icon,sort ascending icon,sort content ascending icon,sort content descending icon,sort descending icon,sort icon,sort numeric ascending icon,sort numeric descending icon,table icon,align center icon,align justify icon,align left icon,align right icon,attach icon,bold icon,copy icon,cut icon,font icon,header icon,indent icon,italic icon,linkify icon,list icon,ordered list icon,outdent icon,paragraph icon,paste icon,save icon,strikethrough icon,subscript icon,superscript icon,text height icon,text width icon,underline icon,unlink icon,unordered list icon,dollar icon,euro icon,lira icon,pound icon,ruble icon,rupee icon,shekel icon,won icon,yen icon,american express icon,discover icon,google wallet icon,mastercard icon,paypal card icon,paypal icon,stripe icon,visa icon,adn icon,android icon,angellist icon,apple icon,behance icon,behance square icon,bitbucket icon,bitbucket square icon,bitcoin icon,buysellads icon,codepen icon,connectdevelop icon,dashcube icon,delicious icon,deviantart icon,digg icon,dribbble icon,dropbox icon,drupal icon,empire icon,facebook icon,facebook square icon,flickr icon,forumbee icon,foursquare icon,git icon,git square icon,github alternate icon,github icon,github square icon,gittip icon,google icon,google plus icon,google plus square icon,hacker news icon,instagram icon,ioxhost icon,joomla icon,jsfiddle icon,lastfm icon,lastfm square icon,leanpub icon,linkedin icon,linkedin square icon,linux icon,maxcdn icon,meanpath icon,medium icon,pagelines icon,pied piper alternate icon,pied piper icon,pinterest icon,pinterest square icon,qq icon,rebel icon,reddit icon,reddit square icon,renren icon,sellsy icon,shirtsinbulk icon,simplybuilt icon,skyatlas icon,skype icon,slack icon,slideshare icon,soundcloud icon,spotify icon,stack exchange icon,stack overflow icon,steam icon,steam square icon,stumbleupon circle icon,stumbleupon icon,tencent weibo icon,trello icon,tumblr icon,tumblr square icon,twitch icon,twitter icon,twitter square icon,viacoin icon,vimeo icon,vine icon,vk icon,wechat icon,weibo icon,whatsapp icon,windows icon,wordpress icon,xing icon,xing square icon,yahoo icon,yelp icon,youtube icon,youtube play icon,youtube square icon',

    ) );
}




/**
 * Display Icon Type
 *
 * @param $field
 * @param $escaped_value
 * @param $object_id
 * @param $object_type
 * @param $field_type_object
 */
function cmb2_render_icon( $field, $escaped_value, $object_id, $object_type, $field_type_object ) {
    ?>
    <div class="cmb2-icon-picker">
        <?php
        //st_debug( $field_type_object );

        echo $field_type_object->input(
            array(
                'class' => 'cmb2-icon-value',
                'name'  => $field_type_object->_name( ),
                'id'    => $field_type_object->_id( ),
                'value' => $escaped_value,
                'type'  => 'hidden',
                'desc'  => '',
            )
        );

        ?>
        <div class="cmb2-icon-selected"><?php
            if ( $escaped_value != '' ){
                echo '<i class="'.esc_attr( $escaped_value ).'"> </i>';
            }
            ?></div>
        <input class="cmb2-search-icons" placeholder="<?php esc_attr_e( 'Search Icon', 'wp-coupon' ); ?>" type="text">
        <div class="cmb2-list-icons hide"></div>

    </div>

    <?php
    // st_debug( $field_type_object );
    if( $field->args['desc'] != '' ){
        echo '<p class="clear cmb2-metabox-description">'.balanceTags(  $field->args['desc'] ).'</p>';
    } ?>


    <?php
}
add_action( 'cmb2_render_icon', 'cmb2_render_icon', 10, 5 );