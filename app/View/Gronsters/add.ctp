<!-- File: /app/View/Gronsters/add.ctp -->

<?php // Set total to zero since this is the first panel ?>
<script type="text/javascript">
	var total=<?php echo json_encode(0); ?>;
</script> 
	<div id="drawing-controls-container" class="gronster-container">

	<div id="control-bar">
		<h2 id="no-js-heading">Welcome to Gronster</h2>
		<?php echo $this->element('controls'); ?>
		<?php echo $this->Form->create('Gronster'); ?>
		<?php $options = array('label' => 'Next', 'name' => 'Next',  'div' => array( 'class' => 'js-only submit button-small', )); ?>
		<?php echo $this->Form->end($options); ?>
	</div> <!-- end control-bar -->

	<?php echo $this->element('canvas'); ?>
</div>

<div id="intro-help-modal" class="reveal-modal">
	<h1><?php echo $helptitle; ?></h1>
	<p><?php echo $helptext; ?></p>
	<a class="close-reveal-modal">&#215;</a>
</div>
