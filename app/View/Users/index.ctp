<!-- File: /app/View/Users/index.ctp -->
 <?php 
 foreach ($users as $user): 
    echo $this->Html->link($user['User']['email'],array('controller' => 'users', 'action' => 'view', $user['User']['id']));
 	echo '<br />';
 endforeach;
 ?>