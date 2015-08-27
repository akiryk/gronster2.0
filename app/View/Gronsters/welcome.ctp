<!-- File: /app/View/Drawings/welcome.ctp -->
<div id="welcome-container">
	<div class="no-padding">
	<h1>What is gronster?</h1>
	<div id="welcome-content">
		<div id="welcome-block1" class="welcome-block">
			<h2 class="welcome">You draw <br/>one section</h2>
			<div id="help-head" class="welcome-image">
				<?php echo $this->Html->image('welcome/welcome-head-1.png',array('alt'=>'illustrated head', 
					'class'=>'welcome')); ?>
			</div>
		</div>
		<div id="welcome-block2" class="welcome-block">
			<h2 class="welcome">Your friends<br/>draw the rest</h2>
			<div id="help-body" class="welcome-image">
				<?php echo $this->Html->image('welcome/welcome-middle-1.png',array('alt'=>'illustrated body',
					'id'=>'body-image', 'class'=>'welcome')); ?>
				<?php echo $this->Html->image('welcome/welcome-legs-1.png',array('alt'=>'illustrated legs',
					'id'=>'legs-image', 'class'=>'welcome')); ?>
			</div>
		</div>
		<div id="welcome-block3" class="welcome-block">
			<h2 class="welcome">We combine them to make a gronster!</h2>
			<div id="full-guy" class="welcome-image">
				<?php echo $this->Html->image('welcome/welcome-body-1.png',array('alt'=>'illustrated man','id'=>'full-guy-image')); ?>
			</div>
		</div>
	</div><!-- welcome-content -->
</div> <!-- #welcome-container -->
<div id="welcome-button-container" class="button-container">
<?php 
	echo $this->Html->link('Get Started!',array('controller' => 'gronsters', 'action' => 'add'),
		array('id'=>'get-started','class'=>'button'));
?>
</div></div>