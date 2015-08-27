<?php

/**
 * Panels controller
 *
 * A panel is one part of the triptych.
 *
 */
class PanelsController extends AppController {

/**
 * Controller name
 *
 * @var string
 */
  public $name = 'Panels';

/**
 * Default helper
 *
 * @var array
 */
  public $helpers = array('Html', 'Session');

/**
 * Default component containing custom image handler
 *
 * @var array
 */
  public $components = array('GronsterImage', 'GronsterEmail', 'Session');
  
  
  public function index(){
    // we shouldn't show all the panels since they only display in the context of a Drawing. 
    $this->redirect(array('action' => '../gronsters/index'));
    // $this->set('panels', $this->Panel->find('all'));
  }
  
  public function view($id=null){
    $this->Panel->id = $id;
    $this->set('panel', $this->Panel->read());  
  }
  
  public function edit($id=null){
    $this->Panel->id = $id;
    if ($this->request->is('get')) {
      // Display the panel so that it can be edited
      $this->request->data = $this->Panel->read();
    } else {
      if ($this->Panel->save($this->request->data)) {
        $this->Session->setFlash('Your panel has been updated.');
        $this->redirect(array('action' => '/gronsters/index'));
      } else {
        $this->Session->setFlash('Unable to update your panel.');
      }
    }
  }
  
    /**
  * Delete a panel
  */ 
  public function delete($id) {
    if ($this->request->is('get')) {
        throw new MethodNotAllowedException();
    }
    if ($this->Panel->delete($id)) {
        $this->Session->setFlash('The panel with id: ' . $id . ' has been deleted.');
        $this->redirect(array('action' => '/gronsters/index'));
    }
  }
  
  // Called from ajax when saving the panel
  public function add(){
    $errors = array();
    if ($this->request->is('post')) {
      if (!empty($this->request->data)) {
        $this->autoRender = false;
        // Get the data we need from serialized form: 
        $img = $this->request->data['img'];
        $placement = $this->request->data['Panel']['placement'];
        $gronster_id = $this->request->data['Panel']['gronster_id'];

      //  Use component to save image and return its new name.
      $filename = $this->GronsterImage->saveImage($img);
      $filepath = $this->GronsterImage->getPath();
    
        // get the data into proper array
        $data = array( 'Panel' => array ( 
                'filename' => $filename, 
                'filepath' =>  $filepath, 
                'placement' => $placement,
                'gronster_id' => $gronster_id));
        
        // Then save like this: (see: http://book.cakephp.org/2.0/en/models/saving-your-data.html)
        if ($this->Panel->save($data)) { 
          $status = 1;
          // Get a reference to the drawing this panel belongs to:
          $gronster = $this->Panel->Gronster->read(null, $gronster_id);
          // Find out how many panels are in that drawing:
              $panel_count = $gronster['Gronster']['panel_count'];
                
              if ($panel_count==3){

                // DRAWING IS DONE!!!

                // 1. Merge the panels into one drawing
              // Create an array of images, a large one and a small
          $img_array = $this->GronsterImage->mergeImages($gronster['Panel']);
        
          if ($this->Panel->Gronster->save($img_array)){
            $status = 1;
          } else {
            $status = 0;
          }

          // 2. Delete the panels from server since we now have a finished drawing
            $file_array = array(); // An array to store the files to be deleted
            foreach($gronster['Panel'] as $panel):
              $file_array[] = $panel['filepath'] . $panel['filename'];
              $this->Panel->delete($panel['id']);
            endforeach;
          $this->GronsterImage->deleteImageFiles($file_array);

          // 3. Email the drawers to let them know
          $users = $gronster['User'];
          $subject = "Your Gronster is finished!";
          $message = "Check out the finished drawing here: ";
          $url    =  "http://gronster.adamkiryk.com/gronsters/view/" . $gronster['Gronster']['id'];
          $from = "gronster@gronster.com";
          foreach($users as $user):
            $sendout = $this->GronsterEmail->send($user['email'], $from, $subject, $message, $url);
          endforeach;


          // 4. Redirect
          die (json_encode(array('status'=>$status,'gronster_id'=> $gronster_id, 'done' => 1)));
              } else {
                die (json_encode(array('status'=>$status,'gronster_id'=> $gronster_id, 'done' => 0)));
              }
          
      } else {
          die (json_encode(array('status'=>0, 'errors'=>"didn't save")));
      }
      } // close if (!empty)
    } // close if (post) 
  } // close add()

  /*
  * Send announcement to the artists that their drawing is done
  * Loop through the users associated with this drawing and call 'send' function
  *
  * @param $users is the array of users associated with this drawing
  */
  // private function sendFinished($drawing){
  //  echo "hello.";
  // }

    

}