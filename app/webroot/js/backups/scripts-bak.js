$(document).ready(function () {
      
	/* ********************************************************
	 * ********************* CANVAS CONTROLS ******************
	/* ******************************************************** */
	var width = 660;
	var height = 335;
	var offset = 20;
	var canvas;
	var context; 

	var filepath = "http://localhost/cake";// "http://gronster.adamkiryk.com";//   

	var colorPurple = "#cb3594";
	var colorGreen = "#659b41";
	var colorYellow = "#ffcf33";
	var colorBrown = "#986928";

	var curColor = colorPurple;
	var clickColor = new Array();

	// Sizes
	var clickSize = new Array();
	var curSize = 4;

	// Tools
	var erase = false;
	
	var loadGuide = false;
	var loaded = false;
	

	initCanvas();
	
	function initCanvas(){
		if (isCanvasSupported()){
			startDrawing();
		} else {
			// do something to let user know what's up.
		}
	}
	
	function startDrawing(){
		// set canvas and context variables for rest of scripts
		canvas = document.getElementById("canvasElement"); 
		canvas.width =  width;
		canvas.height = height;
		 
	  context = canvas.getContext('2d');

	    // Fill in the top part of canvas with previous drawing.
		  // Only do this if there is a previous drawing.
	  if(typeof topimage != 'undefined'){
	  	loadGuide = true;
	  	var imageObj = new Image(); 
			imageObj.onload = function() {
				loaded=true;
				redraw();
			}
			var path = filepath + topimage; //"/img/drawings/4fd3a54ece7c4.png";
		  imageObj.src = path;
    }

		var clickX = new Array();
		var clickY = new Array();
		var clickDrag = new Array();
		var paint;
		
		$('#canvasElement').mousedown(function(e){
		  var mouseX = e.pageX - this.offsetLeft;
	    var mouseY = e.pageY - this.offsetTop;
		  paint = true;
		  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		  redraw();
		  return false;
		}); // end mousedown()
			  
		$('#canvasElement').mousemove(function(e){
	  	if(paint){
		    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
		    redraw();
	  	}
		}); /// end mousemove()
	 
	  $('#canvasElement').mouseup(function(e){
		  paint = false;
		}); // end mouseup()
		
		$('#canvasElement').mouseleave(function(e){
  		paint = false;
		});

		// $('#toggle').click(function(){
		// 	if(erase){
		// 		erase = false;
		// 	} else {
		// 		erase = true;
		// 	}
		// });

		

		function addClick(x, y, dragging)
		{
		  clickX.push(x);
		  clickY.push(y);
		  clickDrag.push(dragging);
		  if (erase){
		  	clickColor.push("white");
		  } else {
		  	clickColor.push(curColor);
		  }
		}

		function drawGuideImage(){
      // draw cropped image
      var sourceX = 0;
      var sourceY = height-(offset * total); // 220 - 40 = 180;
      var sourceWidth = width; // 490
      var sourceHeight = offset; // 20
      var destWidth = sourceWidth;
      var destHeight = sourceHeight;
      var destX = 0;
      var destY = 0;
      context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
      
		}
		
		function redraw(){ 
			clearCanvas();
		  context.lineJoin = "round";
					
		  for(var i=0; i < clickX.length; i++)
		  {		
		    context.beginPath();
		    if(clickDrag[i] && i){
		      context.moveTo(clickX[i-1], clickY[i-1]);
		    } else {
		       context.moveTo(clickX[i]-1, clickY[i]);
		    }
				context.lineTo(clickX[i], clickY[i]);
				context.closePath();
				context.strokeStyle = clickColor[i];
				context.lineWidth = 4;
				context.stroke();
		  }

		  if (loadGuide && loaded){
		  	drawGuideImage();
		  }
			
		} 
		// end redraw()

		/**
		* Clears the canvas.
		*/
		function clearCanvas()
		{
			context.fillStyle = '#ffffff'; // Work around for Chrome
			context.fillRect(0, 0, width, height); // Fill in the canvas with white
			canvas.width = canvas.width; // clears the canvas 
		}

	}	// end isCanvasSupported()
	
	// check if browser supports the canvas element
	function isCanvasSupported(){
  	var elem = document.createElement('canvas');
  	return !!(elem.getContext && elem.getContext('2d'));
	}
	
	
	/* ********************************************************
	 * ********************* AJAX FORM CONTROLS ***************
	/* ******************************************************** */
	
	// This flag will prevent multiple comment submits: 
	var working = false;

	/**
	 * Override the Drawing submit button click event on drawing/add page.
	 * Works with handleData() and ajaxSubmit() functions.
	 *
	 * @param bool $working sets whether submit is underway.
	 */
	$('#GronsterAddForm').submit(function(e){
	  if (formReady(e)) {
			// get serialized formdata that includes image data
			var formdata = handleData($(this));
			var submit_url = filepath + "/gronsters/add";
			ajaxSubmit(formdata, submit_url);
		} else {
			return false;
		}
	});
	
	/**
	 * Override the Panel submit button click event on drawing/add page.
	 * Works with formReady(), handleData() and ajaxSubmit() functions.
	 *
	 * @param bool $working sets whether submit is underway.
	 */
	$('#PanelAddForm').submit(function(e){	
		if (formReady(e)) {
			// get serialized formdata that includes image data
			var formdata = handleData($(this));
			var submit_url = filepath + "/panels/add";
			ajaxSubmit(formdata, submit_url);
		} else {
			return false;
		}		
  });
	
	/**
	 * Override the submit button click event on drawing/add page 
	 * And make sure form isn't already being submitted.
	 *
	 * @return bool telling is form ready or not.
	 */
	function formReady(e){
		// stop form from doing its normal behavior
		e.preventDefault(); 
			
		// Make sure a submit isn't already underway.
		if(working) return false;
		working = true;
		$('#submit').val('Working..');
		$('span.error').remove();
		return true;
	}
	
	/**
	 * Gets data from the form and from the canvas image.
	 * Turns it into something that can be sent to the php form handler.
	 *
	 * @return string formdata, a serialized array of form and image data.
	 */
	function handleData(form){
		// get the form data:
  	var d = form.serialize();
  	
    var imagedata;
    
    // If topimage isn't defined, then we know that this is the first image.
    // Therefore, we shouldn't crop the image. We only crop to remove the guidelines from previous image. 
	  if(typeof topimage == 'undefined'){
	    // get the image data:
	    imagedata = "&img=" + canvas.toDataURL("image/png"); 
	  } else {
	  	// create a new canvas element to contain the new, cropped image
		  var newCanvas = document.createElement("canvas");
	    newCanvas.width = width;
	    newCanvas.height = height-offset;          
	    var newImageData = context.getImageData(0, offset, width, height-offset);
	    newCanvas.getContext("2d").putImageData(newImageData, 0, 0);
		  imagedata = "&img=" + newCanvas.toDataURL();
	  }
  	var formdata = d + imagedata;
  	return formdata;
	}
	
	/**
	 * Override the submit button click event on drawing/add page.
	 * Works with handleData() and ajaxSubmit() functions.
	 *
	 * @param bool $working sets whether submit is underway.
	 */
	function ajaxSubmit(formdata, submiturl){
		//alert("form: " + formdata);
		$.ajax({
		  type: "POST", 
		  url: submiturl,
		  data: formdata,
		  dataType: "json",
		  success: function(message) {
		  	working = false;
	    	if (message.status) {
	    		// message object contains three possible properties: status, gronster_id, error_msg.
	    		var id = message.gronster_id;
	    		if (message.done) {
	    			// display the finished drawing
	    			window.location.replace(filepath + "/gronsters/view/" + id);
	    		} else {
	    			// let user share it
	    			window.location.replace(filepath + "/gronsters/share/" + id);
	    		}
	    		
	    	} else {
				  $.each(message.errors,function(k,v){
					  $('label[for='+k+']').append('<span class="error">'+v+'</span>');
				  });
			  }
		  },
		  error: function(jqXHR, textStatus, errorThrown) {
		  	alert("failure, error " + jqXHR);
		  }
	  });
	}
});
		



