gronster 2.0
========
Runs on php 5.6.

A drawing game built with cake php and javascript.
The idea of the game is for three participants to each draw one portion of a creature -- head, body and legs.
The app stores the separate drawings in a mysql database and combines them into one png image once all are finished.

###Update app on gronster.adamkiryk.com
1. Redefine ROUTEPATH on line 29 in bootstrap.php for local or remote host. That is, 'localhost' or 'gronster.adamkiryk.com'. `DEFINE("ROUTEPATH", "http://gronster.adamkiryk.com");`
2. If no database, create one (see 'Create Database' below).
3. Update database info in app/Config/database.php. Host should be localhost or remote host, e.g. mysql.gronster.adamkiryk.com. Also update password/username.

### Create Database
```
CREATE DATABASE `gronster` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;

USE `gronster`;

CREATE TABLE `drawings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `panel_count` int(11) NOT NULL DEFAULT '0',
  `drawing_large` varchar(255) DEFAULT NULL,
  `drawing_small` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=423 ;

CREATE TABLE `drawings_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `drawing_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE `gronsters` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `panel_count` int(11) DEFAULT NULL,
  `drawing_small` varchar(255) DEFAULT NULL,
  `drawing_large` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=172 ;

CREATE TABLE `gronsters_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `gronster_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE `panels` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) DEFAULT NULL,
  `filepath` varchar(255) DEFAULT NULL,
  `gronster_id` int(11) DEFAULT NULL,
  `placement` tinyint(4) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1073 ;

CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=79 ;
```