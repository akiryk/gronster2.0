<?php
/**
 * Panels controller
 *
 * A panel is one part of the triptych.
 *
 */
class UsersController extends AppController {

/**
 * Controller name
 *
 * @var string
 */
	public $name = 'Users';

/**
 * Default helper
 *
 * @var array
 */
	public $helpers = array('Html', 'Session', 'Js');

/**
 * Default component containing custom image handler
 *
 * @var array
 */
public $components = array('GronsterEmail');

	public function index(){
		$this->redirect(array('controller' => 'gronsters', 'action' => 'index'));
	  //$this->set('users', $this->User->find('all'));
	}
	
	public function view($id=null){
		$this->User->id = $id;
		$user = $this->User->read();
		$this->set('user', $user);

	}
	
	public function edit($id=null){
		$this->User->id = $id;
	    if ($this->request->is('get')) {
	    	// Display the panel so that it can be edited
	    	$this->set('user', $this->User->read());
	       // $this->request->data = $this->User->read();
	    } else {
	      if ($this->User->save($this->request->data)) {
	        $this->Session->setFlash('User has been updated.');
	        $this->redirect(array('action' => '/gronsters/index'));
	      } else {
	        $this->Session->setFlash('Unable to update user.');
	      }
	    }
	}
	
	/**
	* Allow users to save new posts 
	*/
	public function add() {
    if ($this->request->is('post')) {
	    if ($this->User->save($this->request->data)) {
		      $this->Session->setFlash('User has been saved.');
		      $this->redirect(array('action' => 'index'));
		  } else {
		      $this->Session->setFlash('Unable to add user.');
		  }  
    }
  }

	/** 
	* Get started with a new drawing
	* Allow users to share a drawing with their friend.
	* Saves both the first user's and the second user's information.
	* Needs to check first whether either user already exist in 
	* the database.
	* 
	*/
	public function invite(){
		if ($this->request->is('post')) {
      		if (!empty($this->request->data)) {	
      			$success = true;
	      		$gronster_id = $this->request->data['Gronster']['id'];
	      		$panel_count = $this->request->data['Gronster']['panel_count'];
      		
				// Get all the user email inputs from form
		      	$user_emails = array($this->request->data['User']['to'], $this->request->data['User']['from']);
				foreach($user_emails as $email){
					// Check if the user's email already exists in db.
					$user = $this->User->findByEmail($email);
					if ($user){
						// THe user exists!
						// Check if the user is already joined with this particular drawing
						$joined = $this->User->GronstersUser->find('first', array(
								'conditions' => array(
										'GronstersUser.gronster_id' => $gronster_id, 
										'GronstersUser.user_id'		=> $user['User']['id']
								)
							)
						);
						// If user isn't already joined, join them:
						if(!$joined){
							$this->User->GronstersUser->create();
				            $this->User->GronstersUser->saveField('gronster_id', $gronster_id);
				            $this->User->GronstersUser->saveField('user_id', $user['User']['id']);
						}
						
					} else {
						// User doesn't exist, so create and associate with the drawing id
						$data = array(
		  					'User' => array('email' => $email),
		          			'Gronster' => array('id' => $gronster_id)
						);
						if ($this->User->save($data)) {
		      				$success=true;
			  			} else {
				      		$success=false;
			  			}	  
					}	
				}

				$to = $this->request->data['User']['to'];
				$from = $this->request->data['User']['from'];
				$name =  $this->request->data['User']['firstname'];

				$this->Session->write("email", $from); // keep the user's email in the session
				$this->Session->write("username", $name);

				if ($panel_count == 1){
					$message = $name . " has invited you to draw the middle part of a Gronster, which is a drawing made of three parts that get combined for an unexpected result. \n
How to do it: Follow the link below and draw your portion of the creature. You'll see just enough of the bottom part of the head so that your part can connect. When you're finished, you can invite a third friend to participate — and once all three parts are done, we’ll combine them into one and show you the end result. Get started here:) \n \n";
				} else {
					$message = $name . " has invited you to draw the bottom part of a Gronster, which is a drawing made of three parts that get combined for an unexpected result. \n
How to do it: Follow the link below and draw your portion of the creature. You'll see just enough of the bottom part of the body so that your part can connect. When you're finished, we’ll combine all three segments into one and show you the end result. Get started here: \n \n";
				}

				$subject = "Join a drawing game";
				$url 	  = "http://gronster.adamkiryk.com/gronsters/view/".$gronster_id;
				$fromMail = array("gronster@gronster.com" => $name);
				$this->GronsterEmail->send($to, $fromMail, $subject, $message, $url);

				if($success){
					$this->Session->setFlash('Success.');
						// Redirect along with drawing id
			       $this->redirect(array('controller' => 'gronsters', 'action' => 'thanks', $gronster_id));
				} else {
					$this->Session->setFlash('Unable to add user.');
			        $this->redirect(array('controller' => 'gronsters', 'action' => 'thanks', $gronster_id));
				}  
			}
	    }
	}

  /**
  * Delete a user
  */ 
  public function delete($id) {
    if ($this->request->is('get')) {
        throw new MethodNotAllowedException();
    }
    if ($this->User->delete($id)) {
        $this->Session->setFlash('The user with id: ' . $id . ' has been deleted.');
        $this->redirect(array('action' => 'index'));
    }
  }

	
}
