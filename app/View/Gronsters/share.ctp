<!-- File: /app/View/Drawings/share.ctp -->
<div id="share-container" class="gronster-container">
	<div class="info-container" >
	<h1>Now share with a friend!</h1>
	<?php
		echo $this->Form->create('User', array(
		                                    'action' => 'invite',
		                                    'controller' => 'users')  
		                                );

		if (isset($username)){
			echo $this->Form->input('firstname', array('label'=>"Your name", 'default'=>$username, 
			'type' => 'text', 'class'=>'user-input completed'));
		} else {
			echo $this->Form->input('firstname', array('label'=>"Your name", 'default'=>'your name', 
			'type' => 'text', 'class'=>'user-input'));
		}

		if (isset($from)){
			echo $this->Form->input('User.from', array('label'=>"Your email",'default'=>$from, 'class'=>'user-input completed','type'=>'email'));
		} else {
			echo $this->Form->input('User.from', array('label'=>"Your email",'default'=>'your email', 'class'=>'user-input','type'=>'email'));
		}
		
		echo $this->Form->input('User.to', array('label'=>"Your friend's email", 'default'=>"your friend's email",
			'class'=>'user-input','type'=>'email'));
	  	echo $this->Form->hidden('Gronster.id', array('default'=>$gronster['Gronster']['id']));
	  	echo $this->Form->hidden('Gronster.panel_count', array('value'=>$gronster['Gronster']['panel_count']));
		echo $this->Form->end(array('label'=>'Invite', 'class'=>'special-button use-transition')); 
	?>
	<div id="keep-drawing">
		<?php echo $this->Html->link("Nah, I just want to keep drawing...",array('controller' => 'gronsters', 'action' => 'view', $gronster['Gronster']['id'])); ?>
	</div>
	
	</div> <!-- end #sharing -->
	<div id="shadow"></div>
</div>

