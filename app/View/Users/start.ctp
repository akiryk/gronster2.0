<!-- File: /app/View/Users/start.ctp -->
<h1>Share with a friend</h1>
<?php
    echo $this->Form->create('User');
    echo $this->Form->input('User.email 1', array('label'=>"Your friend's email"));
    echo $this->Form->input('User.email 2', array('label'=>"Your email"));
	echo $this->Form->end('Send');
?>