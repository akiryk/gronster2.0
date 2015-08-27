
/*
* First and only function called from draw_layout on document ready
* is in the html file (see draw_layout.ctp).
*/

function initializeBrushes(filepath, c, ui){
	var brush = new Image();
	var brushpath = filepath + '/app/webroot/img/brushes/';
	brush.onload = function(){
		var b = new BrushObject(this, c);
		initializeSketcher(b); // give sketcher a brush and a colors list
		ui.setBrush(b);
	}
	brush.src = brushpath + "brushes.png";		
}

function initializeColors(){
	var colors = new Dictionary({
		magenta:'#da0587',
		purple: '#290fcd',
		blue: '#038acf',
		white: '#eee',
		green: '#a9d203',
		orange: '#ff7200',
		black: '#000000'
	});
	return colors;
}

function initializeSketcher(brush, colors){
	sketcher.setTools(brush, colors);
	sketcher.makeGuides();
}

// check if browser supports the canvas element
function isCanvasSupported(){
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}

function CanvasUI(filepath, colors){
	// This flag will prevent multiple comment submits: 
	var working = false;

	this.filepath = filepath;
	this.colors = colors;
	this.brushObj;
	var self = this; // so jquery functions have access to HandleUI property
	/**
	 * Override the Drawing submit button click event on drawing/add page.
	 * Works with handleData() and ajaxSubmit() functions.
	 *
	 * @param bool $working sets whether submit is underway.
	 */
	$('#GronsterAddForm').submit(function(e){
		doSubmit($(this), e, filepath + "/gronsters/add"); 
	});
	
	/**
	 * Override the Panel submit button click event on drawing/add page.
	 * Works with formReady(), handleData() and ajaxSubmit() functions.
	 *
	 * @param bool $working sets whether submit is underway.
	 */
	$('#PanelAddForm').submit(function(e){	
	  doSubmit($(this), e, filepath + "/panels/add");
  });

	/* COLOR SELECTION */
	$('#color-button').click(function() {
		if( $(this).hasClass('open')) {
			$(this).removeClass('open');
		} else {
			$(this).addClass('open');
		}
		$('#colors').toggle();
		return false;
	});

	$('ul#colors li').click(function() {
		var colorName = $(this).attr('class');
		self.setSelectColor(colorName);
		$('#color-button').trigger('click');
	});

	$('.select-color').css('background', colors.lookup('purple') );
	
	/* BRUSH SIZE SELECTION */
	$('#size-button').click(function() {
		if( $(this).hasClass('open')) {
			$(this).removeClass('open');
		} else {
			$(this).addClass('open');
		}
		$('#sizes').toggle();
		return false;
	});

	$('ul#sizes li').click(function() {
		var sizeName = $(this).attr('class');
		self.brushObj.setSize(sizeName);
		$('#size-button .select-size').removeClass('xlarge large medium small xsmall').addClass('select-size ' + sizeName);
		$('#size-button').trigger('click');
	});

	/*
	* Handle the submit function for both gronster add form and panel add form
	* @var e: event
	* @var submit_url: the action to handle submit. 
	* @var this: the form submit element.
	*/
	function doSubmit(form, e, submit_url){
		if (!sketcher.isSaveSafe()){
			e.preventDefault();
	  	return false;
	  } else if (formReady(e)) {
  		// get serialized formdata that includes image data
			var formdata = handleData(form);
			ajaxSubmit(formdata, submit_url);
		} else {
			// form isn't ready
			return false;
	  } 
	}
	
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
 		// Return the serialized form plus the encoded image data.
  	var formdata = form.serialize() + "&img=" + sketcher.toString();
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
	};
}

CanvasUI.prototype.setSelectColor = function(colorName){
	var colorVal = this.colors.lookup(colorName);
	$('.select-color').css('background', colorVal );
	this.brushObj.setColor(colorName);
}

CanvasUI.prototype.setSelectSize = function(sizeName){
	var sizeVal = this.brushObj.yIndex.lookup(sizeName);
	$('.select-size').css('background', colorVal ).removeClass();
	//this.brushObj.setColor(colorName);
}

CanvasUI.prototype.setBrush = function(b) {
	this.brushObj = b;
}
		
/*
* Hide cursor in chrome when dragging 
*/
function disableSelect(){
	document.onselectstart = function(){ return false; }
}
function enableSelect(){
	document.onselectstart = function(){ return true; }
}

/* 
* Dictionary Constructor 
*/
function Dictionary(startValues){
	this.values = startValues || {};
}
Dictionary.prototype.store = function(name, value){
	this.values[name] = value;
}
Dictionary.prototype.lookup =function(name){
	return this.values[name];
}

/*
* Canvas constructor
* @var width is width of canvas element
* @var height is height of canvas element
* @var offset is 
*/
function CanvasElement(w,h,o) {
	this.width = w;
	this.height = h;
	this.offset = o;

	/* 
	* There are three canvases: 
	* Top canvas is for the cursor
	* Middle is called drawing and is the context where we make and save the drawing
	* Bottom is called guide and is where we show dotted line guide */
	this.top_canvas = $("#top");
	this.top_canvas_context = this.top_canvas.get(0).getContext("2d");	

	this.drawing = $('#drawing');
	this.context = this.drawing.get(0).getContext("2d");

	// Dashed guideline
	this.guide = $('#guide');
	this.guide_context = this.guide.get(0).getContext("2d");
}

/* 
* Brush Constructor
*/
function BrushObject(brush, colors){
	this.brush = brush; // the .png with brush colors and sizes on it
	this.colors = colors;
	this.sizeName = 'medium';
	this.colorName = 'purple';

	// map to the location of each color on the brushes graphic
	this.xIndex = new Dictionary({
		magenta:1,
		purple: 2,
		blue: 4,
		white: 6,
		green: 0,
		orange: 3,
		black: 5
	});
	this.yIndex = new Dictionary({
		xsmall: [6,58],
		small: [8, 50],
		medium: [10, 40],
		large: [16, 24],
		xlarge: [24, 0]
	});

	this.setSize(this.sizeName);
	this.setColor(this.colorName); // Starting color;
	this.update();

}

BrushObject.prototype.setColor = function(color){
	this.colorName = color;
	this.color = this.colors.lookup(color);
	this.update();
}

BrushObject.prototype.getColor=function(){
	return this.color;
}

/* Set the size and location of brush
* @var brushSize is diameter of the brush
* @var halfBrushSize is half. Calculated once so we don't have to do it every loop and mouse move.
*/
BrushObject.prototype.setSize=function(size){
	this.sizeName = size;
	this.brushSize = this.yIndex.lookup(size)[0]; // brushsize is first element of array
	this.halfBrushSize = this.brushSize / 2; 
	this.update();
}

BrushObject.prototype.getSize=function(){
	return this.brushSize;
}

/*
* Change x,y coordinates so that the right brush will display
* @var y is based on the y location of the color on brushes.png
* @var x is based on the placement of color * brush size.
*/
BrushObject.prototype.update = function(){
	this.y = this.yIndex.lookup(this.sizeName)[1];
	this.x = this.brushSize * this.xIndex.lookup(this.colorName);
}

BrushObject.prototype.getX = function(){
	// Calculate the x placement of the color on the brush graphic.
	return this.x; //(4*9); // green, which is 5th color;
}

BrushObject.prototype.getY=function () {
	// Calculate the y placement of the color on the brush graphic.
	return this.y;
}

BrushObject.prototype.getHalfBrushSize=function(){
	return this.halfBrushSize;
}

/* ********************************************************
* *********************     SKETCHER        ***************
/* ******************************************************** 
*
* Sketcher class
*
* Makes marks with a brush image or else falls back to canvas lines
*/

function Sketcher( canvas ) {
	this.canvas = canvas;
	this.filepath;
	this.brushObj;

	this.top_canvas = this.canvas.top_canvas;
	this.context = this.canvas.context;

	// Drawing isn't safe to save until drawer has included something below dotted line
	this.saveSafe = true; // Will change to false if there is a dotted line.

	// Track dragging so we know whether to draw a line
	this.dragging = false;


	// Check for touch
	// this.touchSupported = Modernizr.touch;
	// temporarily disable touch
	this.touchSupported = false;

	// if(typeof topimage != 'undefined'){
 //  	var imageObj = new Image(); 
 //  	var self = this;
 //  	console.log("path " + this.filepath);
 //  	imageObj.src = this.filepath + topimage;
 //  	console.log("topimage " + topimage);
	// 	imageObj.onload = function(){
	// 		self.drawPrevImage(this); // self = the sketcher object and this = the imageObj
	// 	}
 //  }

  /* Backup styles in case there isn't a brush */
	this.context.strokeStyle = "#000000";
	this.context.lineWidth = 3;
	this.lastMousePoint = {x:0, y:0};
    
	if (this.touchSupported) {
		this.mouseDownEvent = "touchstart";
		this.mouseMoveEvent = "touchmove";
		this.mouseUpEvent = "touchend";
	}
	else {
		this.mouseDownEvent = "mousedown";
		this.mouseMoveEvent = "mousemove";
		this.mouseUpEvent = "mouseup";
	}
	// only bind to what is necessary
	this.top_canvas.bind( this.mouseDownEvent, this.onCanvasMouseDown() );
	this.top_canvas.bind( this.mouseMoveEvent, this.onCanvasMouseMove() );
	this.top_canvas.bind( "mouseleave", this.onCanvasMouseLeave() );
}

Sketcher.prototype.setTools = function(brushObj){
	this.brushObj = brushObj; 

	// Check for brush image and use it if available
	///this.renderFunction = (brush == null || brush == undefined) ? this.updateCanvasByLine : this.updateCanvasByBrush;
	this.renderFunction = this.updateCanvasByBrush;
}


Sketcher.prototype.makeGuides = function(){
	if(typeof total != 'undefined'){
		// If this is first or second panel,
  		// draw a dotted baseline to indicate section that will be passed to next drawer.
		if( total < 2){
	  		this.saveSafe = false;
	  		this.drawBaseline();
		}

	    // Show whether artist should draw the top, middle or bottom
	    this.firstDraw = false;
	    switch(total) {
	    	case 0:
	    		$('#welcome').prepend('<h3>Draw the upper body</h3><p>(this will disappear as you start drawing)</p>');
	    		break;
	    	case 1:
	    		$('#welcome').prepend('<h3>Draw the mid-section</h3><p>(this will disappear as you start drawing)</p>');
	    		break;
	    	case 2:
	    		$('#welcome').prepend('<h3>Draw the lower body</h3><p>(this will disappear as you start drawing)</p>');
	    		break;

	    }
	}    
}

Sketcher.prototype.onCanvasMouseDown = function () {
	var self = this;
	return function(event) {
		if (!self.firstDraw) {
			// if this is first time that user is drawing on canvas
			// fade out the welcome message
			self.firstDraw = true;
			$('#welcome').fadeOut('slow');
		}
		disableSelect();
		self.dragging = true;
		self.mouseUpHandler = self.onCanvasMouseUp();
		$(document).bind( self.mouseUpEvent, self.mouseUpHandler );
		self.updateMousePosition( event );
		self.renderFunction( event ); // i.e. updateCanvasByBrush() or updateCanvasByLine()
	}
}

Sketcher.prototype.onCanvasMouseMove = function () {
	var self = this;
	return function(event) {
		if (self.dragging){
			self.renderFunction( event );
	    event.preventDefault();
	    self.drawCursor();
	    if (self.lastMousePoint.y > self.canvas.height - self.canvas.offset) {
	    	self.saveSafe = true;
	    }
	    return false;
	  } else {
	  	self.updateMousePosition( event );
	  	self.drawCursor();
	  }
	  
	}
}

Sketcher.prototype.onCanvasMouseUp = function (event) {
	var self = this;
	return function(event) {
		enableSelect();
		self.dragging = false;
		$(document).unbind( self.mouseUpEvent, self.mouseUpHandler );
		
		self.mouseMoveHandler = null;
		self.mouseUpHandler = null;
	}
}

/*
* Remove cursor when mouse is off the canvase
*/
Sketcher.prototype.onCanvasMouseLeave = function (event) {
	var self = this;
	return function(event) {
		self.clear(self.canvas.top_canvas_context);
	}
}

Sketcher.prototype.updateMousePosition = function (event) {
 	var target;
	if (this.touchSupported) {
		target = event.originalEvent.touches[0]
	}
	else {
		target = event;
	}
	var offset = this.top_canvas.offset();
	this.lastMousePoint.x = target.pageX - offset.left;
	this.lastMousePoint.y = target.pageY - offset.top;

}

Sketcher.prototype.updateCanvasByLine = function (event) {
	this.context.beginPath();
	this.context.lineWidth = 8;
	this.context.lineCap = 'round';
	this.context.moveTo( this.lastMousePoint.x, this.lastMousePoint.y );
	this.updateMousePosition( event );
	this.context.lineTo( this.lastMousePoint.x, this.lastMousePoint.y );
	this.context.stroke();
}

Sketcher.prototype.updateCanvasByBrush = function (event) {
	// Shortcuts to key variables
	var brush = this.brushObj.brush;
	var brushSize = this.brushObj.getSize();
	var brushX = this.brushObj.getX(); 
	var brushY = this.brushObj.getY();
	var halfBrushSize = this.brushObj.getHalfBrushSize();
	var start = { x:this.lastMousePoint.x, y: this.lastMousePoint.y };
	this.updateMousePosition( event );
	var end = { x:this.lastMousePoint.x, y: this.lastMousePoint.y };
	
	var distance = parseInt( Trig.distanceBetween2Points( start, end ) );
	var angle = Trig.angleBetween2Points( start, end );

	var x,y;
	for ( var z=0; (z<=distance || z==0); z++ )
	{
		x = start.x + (Math.sin(angle) * z) - halfBrushSize; // use halfBrushSize so we don't have to calc every time
		y = start.y + (Math.cos(angle) * z) - halfBrushSize;
		//context.drawImage(img,sx,sy,swidth,sheight,dx,dy,dwidth,dheight);
		this.context.drawImage(
		brush, brushX, brushY, brushSize, brushSize, x, y, brushSize, brushSize);
		//this.context.drawImage(brush, 45, 6, 9, 9, x ,y, 9, 9);
		//this.context.drawImage(brush, x,y);
	}
}

Sketcher.prototype.drawCursor = function(){
	var ctx = this.canvas.top_canvas_context;
	this.clear(ctx);
	ctx.beginPath();
	ctx.fillStyle = this.brushObj.getColor(); //selectColor;
	ctx.arc(this.lastMousePoint.x, this.lastMousePoint.y, this.brushObj.getHalfBrushSize() , 0 , 2 * Math.PI, false); 
	// x, y, radius, start angle, end angle, clockwise
	ctx.fill();
}

Sketcher.prototype.toString = function () {

	var dataString = this.canvas.drawing.get(0).toDataURL("image/png");
	var index = dataString.indexOf( "," )+1;
	dataString = dataString.substring( index );
	
	return dataString;
}

Sketcher.prototype.toDataURL = function () {

	var dataString = this.drawing.get(0).toDataURL("image/png");
	return dataString;
}

Sketcher.prototype.clear = function (context) {
	context.clearRect(0,0,this.canvas.width, this.canvas.height);
}

Sketcher.prototype.isSaveSafe = function(){
	return this.saveSafe;
}

Sketcher.prototype.loadPrevImage = function(src){
	
	var imageObj = new Image(); 
	var self = this;
	imageObj.src = src;
	imageObj.onload = function(){
		self.drawPrevImage(this); // self = the sketcher object and this = the imageObj
	}
}
/*
* Draw the bottom part of last image on canvas.
* Enables drawer to connect his/her drawing with previous drawing.
*
* @param imageObj is the previous drawer's image.
*/
Sketcher.prototype.drawPrevImage = function (imageObj) {
	 // draw cropped image
	var sourceX = 0;
	var sourceY = this.canvas.height - this.canvas.offset; 
	var sourceWidth = this.canvas.width; 
	var sourceHeight = this.canvas.offset; 
	var destWidth = sourceWidth;
	var destHeight = sourceHeight;
	var destX = 0;
	var destY = 0;
	this.context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);   
}

/*
* Draw a dotted baseline to show what part of drawing will be passed
* to the next drawer.
*/
Sketcher.prototype.drawBaseline = function() {
	var ctx = this.canvas.guide_context;
	var x = 0;
	var dashLength = 2;
	var count = this.canvas.width/(2*dashLength);
	this.drawDottedLine(dashLength, count, ctx);
}

/*
* Draw a dotted line
* Make a series of rectangles with space to simulate a dotted line
*/
Sketcher.prototype.drawDottedLine = function(dashLength, count, ctx){
	for (var i=0; i<count; i++){
		x = i* dashLength * 2; // if dashlength = 2, then we get: 0, 4, 8, 12, 16...
		ctx.rect(x, this.canvas.height-this.canvas.offset, dashLength, dashLength);
		ctx.fillStyle = '#a3a7e3';
		ctx.fill(); 
	}
}

/* 
* Trig class
*
*/
var Trig = {
	distanceBetween2Points: function ( point1, point2 ) {
		
		var dx = point2.x - point1.x;
		var dy = point2.y - point1.y;
		return Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dy, 2 ) );	
	},
	
	angleBetween2Points: function ( point1, point2 ) {
	
		var dx = point2.x - point1.x;
		var dy = point2.y - point1.y;	
		return Math.atan2( dx, dy );
	}
}




