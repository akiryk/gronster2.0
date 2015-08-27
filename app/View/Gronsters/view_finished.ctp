<!-- File: /app/View/Drawings/view.ctp -->
<?php
	$image = '/' . $gronster['Gronster']['drawing_large'];
	echo $this->Html->image($image, array('alt'=>'a gronster image', 'class'=>'to-fit'));

 ?>