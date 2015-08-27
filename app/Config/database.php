<?php
class DATABASE_CONFIG {

	public $default = array(
		'datasource' => 'Database/Mysql',
		'persistent' => false,
		'host' => 'localhost',
		'login' => 'root',
		'password' => 'root',
		'database' => 'gronster',
		'prefix' => '',
		//'encoding' => 'utf8',
	);
	
	public $test = array(
		'datasource' => 'Database/Mysql',
		'persistent' => false,
		'host' => 'localhost',
		'login' => 'root',
		'password' => 'root',
		'database' => 'gronster',
	);

	// 	DEFINE("DB_SERVER", "mysql.storyengine.adamkiryk.com");
	// DEFINE("DB_USER", "akiryk");
	// DEFINE("DB_PASS", "1Forg3table");
	// DEFINE("DB_NAME", "ak_storyengine");

}
