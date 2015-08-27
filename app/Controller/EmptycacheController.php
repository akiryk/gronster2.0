<?php

/**
 * Panels controller
 *
 * A panel is one part of the triptych.
 *
 */
class EmptycacheController extends AppController {


	public function index(){
		// we shouldn't show all the panels since they only display in the context of a Drawing. 
		Cache::clear();
	}
	


}
