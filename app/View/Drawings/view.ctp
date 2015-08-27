<!-- File: /app/View/Drawings/view.ctp -->
<?php	// If there are fewer than three panels, show the form for creating a new panel ?>
<?php	
    	
	if ($total > 0 && $total < 3): // and less than 3 (since total is less than 3) ?>
  	<script type="text/javascript">
			var topimage=<?php echo json_encode($topimage); ?>;
		</script>
		<?php 
	endif;
	
	if ($total < 3) {
		// Display the canvas element
		echo $this->element('canvas');
		// Create a form that saves to a different controller than Drawings
		echo $this->Form->create('Panel', array(
	                                    'action' => 'add',
	                                    'controller' => 'panels')  
	                                );
	  echo $this->Form->hidden('Panel.placement', array('value' => $total));
	  echo $this->Form->hidden('Panel.drawing_id', array('value'=>$drawing['Drawing']['id']));
		echo $this->Form->end('Save the Panel');
		
    } else {  

    // If there are three or more panels, show the entire triptych. 
		// one way to do this is simply to loop through the post's tags
  		echo  "<br />";
			$image = '/' . $drawing['Drawing']['drawing_large'];
			echo "<div class='to-fit'">
  			echo $this->Html->image($image, array('alt'=>'a gronster image'));
  		echo "</div>";
    }
debug($session);
 ?>
	

