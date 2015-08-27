<!-- File: /app/View/Drawings/share.ctp -->
<h1>Share with a friend</h1>
<?php
	echo $this->Form->create('User', array(
	                                    'action' => 'start',
	                                    'controller' => 'users')  
	                                );
	echo $this->Form->input('User.to', array('label'=>"Your friend's email"));
	if($needSender){
		echo $this->Form->input('User.from', array('label'=>"Your email"));
	} else {
		echo $this->Form->hidden('User.from', array('value'=>$from));
	}
  

  echo $this->Form->hidden('Drawing.id', array('value'=>$drawing['Drawing']['id']));
	echo $this->Form->end('Send'); 
?>
No thanks, I'd like to keep drawing right now.
<?php echo $this->Html->link("Keep drawing",array('controller' => 'drawings', 'action' => 'view', $drawing['Drawing']['id'])); ?>