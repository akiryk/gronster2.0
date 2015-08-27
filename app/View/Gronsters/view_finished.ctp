<!-- File: /app/View/Gronsters/view_finished.ctp -->
<div id="gallery-wrapper">
  <div id="view-finished">
    <div id="sharing-links">
      <!-- AddThis Button BEGIN -->
      <a class="addthis_button_google_plusone" g:plusone:size="medium"></a> 
      <a class="addthis_button_facebook_like" fb:like:layout="button_count"></a>
      <script type="text/javascript">var addthis_config = {"data_track_addressbar":true};</script>
      <script type="text/javascript" src="http://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-505e10f034b962d5"></script>
      <!-- AddThis Button END -->
    </div>
  <?php
    $image = '/' . $gronster['Gronster']['drawing_large'];
    echo $this->Html->image($image, array('alt'=>'a gronster image', 'class'=>'to-fit'));
  ?>
  </div>
</div> <!-- #gallery-wrapper -->
