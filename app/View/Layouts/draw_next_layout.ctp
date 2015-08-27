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
			
			var path = <?php echo json_encode(ROUTEPATH); ?>;
			var brush = new Image();
			var brushpath = path + '/app/webroot/img/brushes/brushes.png'; //filepath + '/app/webroot/img/brushes/';
			// write a timeout function if brush fails to load.
			brush.onload = function(){
				var thisBrush = this;
				var spec = { 
						canvas: {
							listener: 'canvas#top',
							drawing: 'canvas#drawing',
							cursor: 'canvas#top',
							guide:'canvas#guide'
						},
						brush: thisBrush,
						dimensions: {
							width: <?php echo json_encode(WIDTH); ?>,
							height:<?php echo json_encode(HEIGHT); ?>
						},
						offset: <?php echo json_encode(OFFSET); ?>,
						filepath: <?php echo json_encode(ROUTEPATH); ?>,
						drawBaseline: (total < 2) ? true : false, // only draw the dotted baseline if we're on first or second panel
					};
					gronsterApp.init(spec);
			}
			brush.src = brushpath;
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
	  echo $this->Js->writeBuffer(); ?>
	
</body>
</html>
