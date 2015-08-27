<!-- File: /app/View/Users/add.ctp -->
<h1>Send message</h1>
<?php
    echo $this->Form->create('User');
    echo $this->Form->input('from_name', array('label' => 'Your Name')); 
    echo $this->Form->input('from_email', array('label' => 'Your Email'));
    echo $this->Form->input('to', array('label' => "Your friend's email"));
    echo $this->Form->input('subject', array(''));
    echo $this->Form->input('message');
	echo $this->Form->end('Send the email');
?>