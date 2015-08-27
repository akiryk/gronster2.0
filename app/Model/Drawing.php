<?php
class Drawing extends AppModel {
	public $name = 'Drawing';
	public $hasMany = array(
		'Panel' => array(
			'className' => 'Panel',
			'dependent' => true,
			'fields' => array('id', 'filepath', 'filename', 'placement')
			)
	);
    public $hasAndBelongsToMany = array(
	    'User' =>
	        array(
	            'className'              => 'User',
	            'joinTable'              => 'drawings_users',
	            'foreignKey'             => 'drawing_id',
	            'associationForeignKey'  => 'user_id',
	            'unique'                 => true,
	            'conditions'             => '',
	            'fields'                 => '',
	            'order'                  => '',
	            'limit'                  => '',
	            'offset'                 => '',
	            'finderQuery'            => '',
	            'deleteQuery'            => '',
	            'insertQuery'            => ''
	        )
	);
	
	public $validate = array(
		'name' => array(
			'rule' 			=> 'notEmpty',
			'required' 	=> true,
			'message' 	=> 'You need a name!'
			)
	);

}