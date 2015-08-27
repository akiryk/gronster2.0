<?php
class User extends AppModel {
	public $name = 'User';
	 public $hasAndBelongsToMany = array(
	    'Gronster' =>
	        array(
	            'className'              => 'Gronster',
	            'joinTable'              => 'gronsters_users',
	            'foreignKey'             => 'user_id',
	            'associationForeignKey'  => 'gronster_id',
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

	var $validate = array('email' => 'email');
} 
	