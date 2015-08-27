<!-- File: /app/View/Gronsters/thanks.ctp -->
<div id="thanks-container" class="gronster-container">
  <div class="info-container" >
    <h1>Thanks!</h1>
    <p>Your email has been sent. Once the drawing is finished,<br />we'll send you a message to let you know.<br />Or you can always just link to it directly:</p>
    <div id="url-container">
    <?php 
      $url = $this->Html->url(array(
        "controller" => 'gronsters',
        'action' => 'view'), true);
      echo $url.'/'.$id;
    ?>
    </div>
    <div id="welcome-button-container" class="button-container">
      <?php 
      echo $this->Html->link('Start Another?',array('controller' => 'gronsters', 'action' => 'add'),
        array('id'=>'get-started','class'=>'button'));
      ?>
    </div>
  </div> <!-- end #sharing -->
  <div id="shadow"></div>
</div>
