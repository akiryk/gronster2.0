<?php

/**
 * Gronsters controller
 *
 * A Gronster is the set of panels, not any one panel. It's like a triptych.
 *
 */
class GronstersController extends AppController {

/**
 * Controller name
 *
 * @var string
 */
  public $name = 'Gronsters';

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
  public $components = array('GronsterImage', 'Session', 'Cookie');
  
  /**
  * Cookie setup options
  * 
  * See http://book.cakephp.org/2.0/en/core-libraries/components/cookie.html for explanation
  */
  public function beforeFilter() {
      parent::beforeFilter();
      $this->Cookie->name = 'User';
      $this->Cookie->time = '30 days';
      $this->Cookie->domain = 'adamkiryk.com';
      $this->Cookie->key = 'rTI332qs*&sPOw!adre@34SAv!@*(XSL#$%)asGb$@11~_+!@#HKis~#^';
      $this->Cookie->httpOnly = false;
  }

  public $paginate = array(
        'limit' => 10,
        'conditions' => array('Gronster.panel_count' => 0), //array of conditions
            'order' => array('modified' => 'DESC'),
          'numbers' => array('separator'=>'')
    );

  /*
   * Display a set of drawings
   */
  public function index() {
      $this->set('jsIncludes',array('jquery.1.7.2','jquery.orbit-1.2.3.min', 'gallery-scripts'));// load js into view and add
      $this->set('cssIncludes',array('gallery.css'));
      $data = $this->paginate('Gronster'); 
      $this->set('gronsters',$data);
  }

  /*
  * Review All
  * Allow editor to delete inappropriate drawings
  */
  public function reviewAll(){
      $data = $this->paginate('Gronster'); 
      $this->set('gronsters',$data);
  }

  /*
  * View All
  * Allow users to see all drawings at once as thumbnails
  */
  public function viewAll(){
      $this->set('gronsters', $this->Gronster->find('all'));
  }


  public function view($id=null){
    $this->set('jsIncludes',array('jquery.1.7.2','modernizr.custom','jquery.ba-hashchange', 'scripts', 'jquery.reveal'));// load js into view and add
    $this->set('makeCanvas', true);

    // If this user is new, display some help text
    // $e = $this->Session->read("visited");
    // $needs_help = isset($e) ? false:true;
    $needs_help = true;
    $this->Gronster->id = $id;
    $gronster = $this->Gronster->read();
    $this->set('gronster',$gronster);

    $users = $gronster['User'];

    $total = $gronster['Gronster']['panel_count'];
    
    switch($total) {
      case 1:
        // display bottom part of first panel
        $this->set('topimage', '/' . $gronster['Panel'][0]['filepath'] . $gronster['Panel'][0]['filename']);
        $start_message = "Draw the middle of your gronster up here";
        $helpmessage = "A Gronster is a drawing made of three sections: a head, a body, and legs. 
                Your friend has already made the head, so it's your job to draw the body. 
                  <br /><br />Once you're done, you'll
                invite a friend to draw the final part — and once that's finished, we'll combine the three
                pieces into one — a Gronster!";
                break;
      case 2:
        /* panels have a placement variable that can be 0, 1 or 2. The top panel is 0 and the
        *  bottom panel is 2. If total==2, we have two panels already and are displaying a blank
        *  canvas to user so that they can draw the third panel (with placement 2). We want to 
        *  show them the bottom part of the middle panel so they can connect to it. */
        if ($gronster['Panel'][0]['placement'] == 1){
          // $gronster['Panel'][0] is middle, so use it
          $this->set('topimage', '/' . $gronster['Panel'][0]['filepath'] . $gronster['Panel'][0]['filename']);
        } else {
          // $gronster['Panel'][1] is middle, so use that one.
          $this->set('topimage', '/' . $gronster['Panel'][1]['filepath'] . $gronster['Panel'][1]['filename']);
        } 
        $start_message = "Draw the bottom of your gronster up here";  
        $helpmessage = "A Gronster is a drawing made of three sections: a head, a body, and legs. 
                Your friends have already made the head and body, so it's your job to draw the legs. 
                <br /><br />Once you're done, we'll combine the three
                pieces into one — a Gronster!";
        break;
      default:
        $this->redirect(array('action' => '/viewFinished/' . $id));
        break;
    }
    
    $this->set('start_message', $start_message);
    $this->set('helptitle',"A Little Help");
    $this->set('helptext', $helpmessage);
    $this->set('total', $total);
    $this->set('session', $this -> Session -> read("email"));
  }

  public function viewFinished($id=null){
    $this->set('jsIncludes',array('jquery.1.7.2'));// load js into view and add
    $this->Gronster->id = $id;
    $gronster = $this->Gronster->read();
    $this->set('gronster',$gronster);

    $users = $gronster['User'];

    $this->set('session', $this -> Session -> read("email"));

  }
  
  /**
  * Allow users to save new gronster / triptychs
  * This is called from ajax when user makes a new gronster. 
  * Refactor: there's repetition here and in panelscontroller add()
  * 
  * @var $errors: An array that stores error messages
  */ 
  public function add() {
    $this->set('jsIncludes',array('jquery.1.7.2', 'modernizr.custom', 'scripts', 'jquery.reveal'));// load js into view and add
    $this->set('makeCanvas', true); // so default layout can load correct scripts
    $errors = array();
      if ($this->request->is('post')) {
        if (!empty($this->request->data)) {
            $this->autoRender = false;
        $img = $this->request->data['img'];
            
        //  Use component to save image and return its new name.
        $filename = $this->GronsterImage->saveImage($img);
        $filepath = $this->GronsterImage->getPath();

          // Use the following to avoid validation errors:
          unset($this->Gronster->Panel->validate['gronster_id']);
              
            $gronstername = uniqid();
    
            // get the data into proper array
            $data = array(
          'Gronster'  => array('name' => $gronstername),
          'Panel'   => array(
                    array(
                          'filename'   => $filename,
                          'filepath'   =>  $filepath,
                          'placement'  => 0)
                  )
            );
        // Then save like this: (see: http://book.cakephp.org/2.0/en/models/saving-your-data.html)
        if ($this->Gronster->saveAssociated($data,  array('atomic' => true, 'validate' => true))){   
            $gronster_id = $this->Gronster->id;
              die (json_encode(array('status'=>1,'gronster_id'=> $gronster_id, 'done' => 0)));
        } else {
            $this->Session->setFlash('Unable to add your gronster.');
            $errors[] = 'Unable to add gronster.';
            echo '{"status":0,"errors":'.json_encode($errors).'}';
        }
      }   // close if (!empty)
      } else { // not POST
        // Display the welcome/help screen only to first time visitors
        if ($this->Session->read('User.visited') == true) {
        $this -> set('start_message', "Draw the top of your gronster up here");
        $this->set('helptitle',"A Little Help");
        $helpmessage = "A Gronster is a drawing made of three sections: a head, a body, and legs. 
                Since this is a new Gronster, it's your job to draw the head. 
                <br /><br />Once you're done, you'll
                invite a friend to draw the next part. When all three parts are finished, we'll take care of 
                turning them into one — a Gronster!";     
        $this->set('helptext', $helpmessage);
      } else {
        $this->redirect(array('action' => 'welcome'));
      }
      }
    }         // close add function 
  
  public function getPanelCount($id){
    $options = array('conditions' => array('Gronster.id'=>$id), 'fields' => array('panel_count'));
    return $this->Gronster->find($options);
  }

  public function thanks($id=null){
    // need a better way to handle static pages
    $this->set('id', $id);
    $e = $this->Session->read("email");
    $this->set('session', $e);
    $this->set('jsIncludes',array('jquery.1.7.2'));// load js into view and add
  }

  public function welcome(){
    $this->set('jsIncludes',array('jquery.1.7.2'));// load js into view and add
    // tell new users what this is all about
    $this->Session->write('User.visited', true);  
  }


  public function edit($id=null){
    $this->redirect(array('action' => '/index'));
  }

  /*
  * Check how many times user has clicked on the color and brush controllers
  * If they've clicked enough times, show them the tool tip
  */
  public function checkControllerClicks(){  
    if ($this->Session->read('controllerClicks') !== null){
      $clicks = $this->Session->read('controllerClicks') + 1;
    } else {
      $clicks = 1;
    }
    $this->Session->write('controllerClicks', $clicks);
    $data = array(  'clicks' => $clicks);
    // Will halt the script and echo the json-encoded data.
      die(json_encode($data));
  }

  // public function checkColorHelp(){
  //  $clicks = 1 + $this->Session->read('colorClicks');
  //  $this->Session->write('colorClicks', $clicks);
  //  $data = array(  'clicks' => $clicks);
  //  // Will halt the script and echo the json-encoded data.
 //     die(json_encode($data));
  // }

  // public function checkSizeHelp(){
  //  $clicks = 1 + $this->Session->read('sizeClicks');
  //  $this->Session->write('sizeClicks', $clicks);
  //  $data = array(  'clicks' => $clicks);
  //  // Will halt the script and echo the json-encoded data.
 //     die(json_encode($data));
  // }
  
  /**
  * Delete a panel
  */ 
  public function delete($id) {
    if ($this->request->is('get')) {
        throw new MethodNotAllowedException();
    }
    $gronster = $this->Gronster->read(null, $id);
    
    // Create an array to store the files to be deleted
    $file_array = array();
    foreach($gronster['Panel'] as $panel):
      $file_array[] = $panel['filepath'] . $panel['filename'];
    endforeach;
    // make sure we delete the merged image as well:
    if ($gronster['Gronster']['drawing_large'] != null) $file_array[] = $gronster['Gronster']['drawing_large'];
    if ($gronster['Gronster']['drawing_small'] != null) $file_array[] = $gronster['Gronster']['drawing_small'];

    if ($this->Gronster->delete($id)) {
      // Only delete the file images if successful in deleting from DB
      $this->GronsterImage->deleteImageFiles($file_array);
        $this->Session->setFlash('The panel with id: ' . $id . ' has been deleted.');
        $this->redirect(array('action' => 'reviewAll'));
    }
  }

  /*
  * Share drawing project with a friend
  * Display a form where the first user can enter their email
  * and their friend's email and invite the friend to draw the next part.
  * Submitting this form calls the start() function in UsersController.
  *
  * @param $id is id of the drawing that was just saved
  */
  public function share($id){
    $this->layout = 'default';
    $gronster = $this->Gronster->read(null, $id);
    $e = $this->Session->read("email");
    $this->set('jsIncludes',array('jquery.1.7.2','sharing-scripts'));// load js into view and add
    if (isset($e)){
      // use the email from session and don't bother user with filling it in
      $this->set('needSender',false);
      $this->set('from',$this->Session->read("email"));
      $this->set('username', $this->Session->read("username"));
    } else {
      $this->set('needSender',true);
      // ask user for their email
    }
    $this->set('gronster',$gronster);
  }


}
