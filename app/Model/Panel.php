<?php
// There are three panels in each drawing (like panels in a triptych)
class Panel extends AppModel {
	public $name = 'Panel';
	public $belongsTo = array(
		'Gronster'=>array(
			'className'=>'Gronster',
			'foreignKey'=>'gronster_id',
			'counterCache' => true
			)
		);
	
	public $validate = array(
		'filename' => array(
			'rule' 			=> 'notEmpty',
			'required' 	=> true,
			'message' 	=> 'The file or filename is missing.'
			),
		'filepath' => array(
		  'rule'			=> 'notEmpty',
		  'required'	=> true,
		  'message'		=> 'The file path is missing.'
		 )
	);
			
	public function limitDrawings($check, $limit){
		return false;
	}
	
	public function getPanelCount(){
		return 3;
	}
}