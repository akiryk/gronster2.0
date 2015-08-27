<!-- File: /app/View/Gronsters/view.ctp -->
<?php
	// Pass variables for javascript for rendering the guide image or not
	// The variable $total is used to determine whether we are on panel 1, 2 or 3
	// $topimage is path to the previous drawing
 ?>  
	<script type="text/javascript">
		var total= <?php echo json_encode( (int)$total ); ?>;
		var topimage =  <?php echo json_encode(ROUTEPATH); ?> + <?php echo json_encode($topimage); ?>;
	</script>
	<?php 
	
	// If there are fewer than three panels, show the form for creating a new panel
	if ($total < 3) {
		switch ($total) {
			case 0:
				//echo "Start the drawing";
				break;
			case 1:
				//echo "Do the middle, the torso";
				break;
			case 2: 
				//echo "Draw the legs or the bottom part of the figure";
				break;
			default:
				break;
		}
		?>
	<div id="drawing-controls-container" class="gronster-container">
		<div id="control-bar">
				<h2 id="no-js-heading">Welcome to Gronster</h2>
			<?php echo $this->element('controls'); ?>
			<?php
			// Create a form that saves to a different controller than Drawings
			// This is old. take it out if saving works!
			// echo $this->Form->create('Panel', array(
		 //                                    'action' => 'add',
		 //                                    'controller' => 'panels')  
		 //                                );
			echo $this->Form->create(null, array('url' => array( 'action' => 'add', 'controller' => 'panels')));
		  	echo $this->Form->hidden('Panel.placement', array('value' => $total));
		  	echo $this->Form->hidden('Panel.gronster_id', array('value'=>$gronster['Gronster']['id']));
		  	$options = array('label' => 'Next', 'name' => 'Next',  'div' => array( 'class' => 'js-only submit toggler', ));

			echo $this->Form->end($options);
			?>
			</div> <!-- end #control-bar -->
		<?php 
			// Display the canvas element
			echo $this->element('canvas');
		?>
	</div> <!-- end gronster-container  -->
		<?php 
    } else {  

    // If there are three or more panels, show the entire triptych. 
		// one way to do this is simply to loop through the post's tags
  		echo  "<br />";
			$image = '/' . $gronster['Gronster']['drawing_large'];
  		echo $this->Html->image($image, array('alt'=>'a gronster image', 'class'=>'to-fit'));
    }
 ?>
<div id="intro-help-modal" class="reveal-modal">
	<h1><?php echo $helptitle; ?></h1>
	<p><?php echo $helptext; ?></p>
	<a class="close-reveal-modal">&#215;</a>
</div>
 <?php //debug($gronster); ?>
	

