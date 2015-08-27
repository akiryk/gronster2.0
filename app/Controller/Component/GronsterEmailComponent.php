<?php
App::uses('CakeEmail', 'Network/Email');

class GronsterEmailComponent extends Component {
	/*   Look here for the original code: http://www.freecontactform.com/email_form.php  */
  	/**
	* Allow users to send email 
	*/
	public function send($to, $from, $subject, $msg, $url) {
	
		//http://book.cakephp.org/2.0/en/core-utility-libraries/email.html
		//video: http://www.youtube.com/watch?v=Ub37ztuV5Wg
		$message = $msg . $url;
	 	$email = new CakeEmail();
		$email->from($from)
		      ->to($to)
		   	  ->subject($subject);
		if ($email->send($message)){
			return true;
		}
		
	}

}

// This worked:
// 	$email = new CakeEmail(array('log' => true)); 
// 		$email->from(array('me@example.com' => 'My Site'))
//     	->to('adamkiryk@gmail.com')
//     	->subject('About')
//     	->send('My message');
//   }
