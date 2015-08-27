<?php
class GronsterImageComponent extends Component {
  /**
  * @var $pathToPanels string path to where images are saved
  */
  private $pathToPanels = 'img/drawings/'; // path to panels
  private $mergedpath = 'img/merged/'; // path to large merged images
  private $thumbpath = 'img/thumbs/'; // path to thumbnails

  private $thumbwidth = 100;
 
	/**
	* Save the canvas drawing to the webroot/img folder
	* 
	* @return $filename string which can be saved to database.
	*/
	public function saveImage($img) {
	  // Save the image to a file *** NEEDS VALIDATION ***
		// remove header information that's sent with the encoded data
		$img = str_replace('data:image/png;base64,', '', $img);
		$img = str_replace(' ', '+', $img);
		$imgdata = base64_decode($img);
		// create a uniq name for the file
		$filename = $this->getFileName();
		$success = file_put_contents( $this->pathToPanels . $filename, $imgdata);
		return $filename;
	}
	
	/**
	* Get pathToPanels 
	* 
	* @return $pathToPanels string which can be saved to database.
	*/
	public function getPath(){
		return $this->pathToPanels;
	}

	private function getFileName(){
		return uniqid() . '.png';
	}
	

	/**
	* merge images
	* Take an array of images and merge them into one png
	*
	* @var $panels array
	* @return $image_arr, an array of the full size image and a thumbnail
	*/
	public function mergeImages($panels = null){
		// See this: http://stackoverflow.com/questions/4419383/how-can-i-merge-3-images-into-1-image-via-php
    // Create new image to be the destination for the three panels.
    // Height equals the height of the three panels minus the offset of first and second panels.
    $dest = imagecreatetruecolor(WIDTH, HEIGHT * 3 - (2 * OFFSET)) 
    	or die("Cannot initialize a new image");
  	$white = imagecolorallocate($dest, 255, 255, 255);
    imagefill($dest, 0, 0, $white);

    // Create an array identifying each panel by placement
    $panel_array = array();
    // Assign each panel to part of the array
    foreach($panels as $panel):
    	$placement = $panel['placement'];
    	switch($placement){
    		case 0:
    			$panel_array['top'] = $panel;
    			break;
    		case 1:
    			$panel_array['middle'] = $panel;
    			break;
    		case 2:
    			$panel_array['bottom'] = $panel;
    			break;
    		default:
    			break;
    	}
    endforeach;

	    // get references to top, middle and bottom
	    $top    = imagecreatefrompng($this->pathToPanels . $panel_array['top']['filename']);
	    $middle = imagecreatefrompng($this->pathToPanels . $panel_array['middle']['filename']);
	    $bottom = imagecreatefrompng($this->pathToPanels . $panel_array['bottom']['filename']);
	    // imagecopy(dest img, source img, dest x, dest y, src x, src y, src w, src h)
	    // First crop the bottom off of top image and copy it to $dest.
    	imagecopy($dest, $top, 0,0,0,0, WIDTH, HEIGHT - OFFSET); 
    	// Next crop bottom off the middle and copy it to $dest.
    	imagecopy($dest, $middle, 0, HEIGHT - OFFSET, 0, 0, WIDTH, HEIGHT - OFFSET); 
    	// Finally, copy bottom image without cropping.
    	imagecopy($dest, $bottom, 0, 2 * (HEIGHT - OFFSET), 0, 0, WIDTH, HEIGHT); // bottom image is placed at bottom of middle image
    	$filename = $this->getFileName();
    	imagepng($dest, 'img/merged/' . $filename);
	    
	    // clean up 
	    imagedestroy($top);
	    imagedestroy($middle);
	    imagedestroy($bottom);
	    imagedestroy($dest);

	    $image_arr = array();
	    $image_arr['drawing_large'] = $this->mergedpath . $filename;
	    $image_arr['drawing_small'] = $this->getThumb($image_arr['drawing_large'], $filename);
	    //$this->getThumb($image_arr['large'], $filename);
	    return $image_arr;
	}

	private function getThumb($src, $filename){
		$desired_width = $this->thumbwidth;

		// read the source image
		$source_image = imagecreatefrompng($src);
		$width = imagesx($source_image);
		$height = imagesy($source_image);
		/* find the "desired height" of this thumbnail, relative to the desired width  */
  		$desired_height = floor($height*($desired_width/$width));
  		/* create a new, "virtual" image */
		$virtual_image = imagecreatetruecolor($desired_width,$desired_height);

		/* copy source image at a resized size */
 		imagecopyresized($virtual_image,$source_image,0,0,0,0,$desired_width,$desired_height,$width,$height);
  	
  		$nameandpath = $this->thumbpath . $filename;
  		/* create the physical thumbnail image to its destination */
		imagepng($virtual_image, $nameandpath);
		imagedestroy($virtual_image);
		imagedestroy($source_image);
		return $nameandpath;
	}

	public function deleteImageFiles($image_array){
		foreach($image_array as $image):
			if (file_exists($image))
				unlink($image);
		endforeach;
	}
}