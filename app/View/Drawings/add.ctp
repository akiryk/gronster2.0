<!-- File: /app/View/Drawings/add.ctp -->
<?php
	echo $this->Form->create('Drawing');
	// echo $this->Form->input('Drawing.name', array('label'=>'Drawing Name'));
	echo $this->element('canvas');
	?>
		<div id="toggle">Hello</div>
		<div id="clear">clear</div>
	<?php
	echo $this->Form->end('Save Drawing');

	?>
	