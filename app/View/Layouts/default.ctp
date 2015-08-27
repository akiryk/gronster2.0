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
		// echo $this->Html->script('jquery'); // Include jQuery library
		echo $this->Html->script('https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'); // Include jQuery library 
	?>
	<script type="text/javascript" src="//use.typekit.net/wmk2boz.js"></script>
	<script type="text/javascript">try{Typekit.load();}catch(e){}</script>
	<script type="text/javascript">
		$('html').addClass('js');
	</script>
	<?php
		if(isset($jsIncludes)){
    		foreach($jsIncludes as $js){
        		echo $this->Html->script($js);
        	}
        }
        if(isset($makeCanvas)){ ?>
        	<script type="text/javascript">
				$(document).ready(function(e){
					
					var path = <?php echo json_encode(ROUTEPATH); ?>;
					var brush = new Image();
					var brushpath = path + '/img/brushes/brushes.png'; //filepath + '/app/webroot/img/brushes/';
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
     <?php }; ?>

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
	<div id="page-inner" class="clean">
		<div id="navigation-container">
			<ul id="navigation">
				<li>
					<?php 
						$class = $this->Html->action == "welcome" ? "active" : "";
						echo $this->Html->link('<span>Gronster</span>',
							array('controller' => 'gronsters', 'action' => 'welcome'),
							array('class' => $class, 'escape'=>false)); // excape html entities
					 ?>
				</li>

				<li>
					<?php
						if (	$this->Html->action == "add" 
							||  $this->Html->action == "view"
							||  $this->Html->action == "share") 
						{
							$class="active";
						} else { 
							$class = ""; 
						} 
						echo $this->Html->link('<span>Start Drawing</span>',
							array('controller' => 'gronsters', 'action' => 'add'),
							array('class'=> $class, 'escape'=>false)); // excape html entities ?>
				</li>
				<li>
					<?php 
						$class = $this->Html->action == "index" ? "active" : "";
						echo $this->Html->link('<span>Gallery</span>',
							array('controller' => 'gronsters', 'action' => 'index'),
							array('class'=>$class, 'escape'=>false)); ?>
				</li>
		</div>
		<div id="alerts">	<?php echo $this->Session->flash(); ?> </div>
		
		<?php echo $this->fetch('content'); ?>
		
	</div>
	<?php 
	  // Tell Js helper to put scripts here in the head. 
	  echo $this->Js->writeBuffer(); 
	  ?>
	
</body>
</html>
