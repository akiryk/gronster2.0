<?php
/**
 *
 * PHP 5
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright 2005-2012, Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright 2005-2012, Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       Cake.View.Layouts
 * @since         CakePHP(tm) v 0.10.0.1076
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

$cakeDescription = __d('cake_dev', 'Gronster, the drawing game');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<?php echo $this->Html->charset(); ?>
	<title>
		<?php echo $cakeDescription ?>:
		<?php echo $title_for_layout; ?>
	</title>
	<?php
		// JAVASCRIPT FILES
		echo $this->Html->script('jquery'); // Include jQuery library
		echo $this->Html->script('scripts'); // include my own scripts
	?>
	<script type="text/javascript">
		$(document).ready(function(e){
			window.sketcher; // create a global variable for the sketcher object
			if (isCanvasSupported()){
				var canvas = new CanvasElement(
					<?php echo json_encode(WIDTH); ?>, 
					<?php echo json_encode(HEIGHT); ?>, 
					<?php echo json_encode(OFFSET); // bottom part of drawing ?>
				);
				sketcher = new Sketcher(canvas);
				var c = initializeColors(); // returns Dictionary object with colors
				var path = <?php echo json_encode(ROUTEPATH); ?>;
				var ui = new CanvasUI(path, c );
				initializeBrushes(path, c, ui);
			} else {
				// canvas isn't supported so
				// do something to let user know what's up.
			}
		});
	</script>
	<?php
		echo $this->Html->meta('icon');
		
		// CSS STYLES
		echo $this->Html->css('main');
		
		echo $this->fetch('meta');
		echo $this->fetch('css');
		echo $this->fetch('script');
	?>
</head>
<body>
	<div id="page-inner">
		<div id="alerts">	<?php echo $this->Session->flash(); ?> </div>
		<div id="main-container">
			<?php echo $this->fetch('content'); ?>
		</div>
	</div>
	<?php 
	  // Tell Js helper to put scripts here in the head. 
	  echo $this->Js->writeBuffer(); 
	  echo "hello " + $current;
	  ?> 
</body>
</html>
