<!-- File: /app/View/Gronsters/index.ctp -->

    <!-- Here is where we loop through our $posts array, printing out post info -->
<div id="gallery-wrapper">
    <div id="sharing-links">
        <!-- AddThis Button BEGIN -->
        <a class="addthis_button_google_plusone" g:plusone:size="medium"></a> 
        <a class="addthis_button_facebook_like" fb:like:layout="button_count"></a>
        <script type="text/javascript">var addthis_config = {"data_track_addressbar":true};</script>
        <script type="text/javascript" src="http://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-505e10f034b962d5"></script>
        <!-- AddThis Button END -->
    </div>

    <div id="gallery" class="image-display-medium">
        <?php foreach ($gronsters as $gronster): ?>
            <?php 
                if ($gronster['Gronster']['drawing_large'] != null){
                    $image = '/' . $gronster['Gronster']['drawing_large'];
                    echo $this->Html->image($image);
                }
            ?>
        <?php endforeach; ?>
    </div> <!-- #gallery -->
</div><!-- #gallery-wrapper -->
<div id="pagination">
    <?php echo $this->Paginator->numbers(array('first' => 'First page')); ?>
</div>
