/* Classes in the document
* Sketcher
* Trig
*
*/

/*
* Sketcher class
*
* Makes marks with a brush image or else falls back to canvas lines
*/

function Sketcher( guideID, drawingID, topID, brushImage ) {
	// Check for brush image and use it if available
	this.renderFunction = (brushImage == null || brushImage == undefined) ? this.updateCanvasByLine : this.updateCanvasByBrush;
	this.brush = brushImage;

	// Check for touch
	// this.touchSupported = Modernizr.touch;
	// temporarily disable touch
	this.touchSupported = false;

	this.dragging = false;

	/* 
	* There are three canvases: 
	* Top canvas is for the cursor
	* Middle is called drawing and is the context where we make and save the drawing
	* Bottom is called guide and is where we show dotted line guide */
	this.topID = topID;
	this.top_canvas = $("#"+topID);
	this.top_canvas_context = this.top_canvas.get(0).getContext("2d");	

	this.drawingID = drawingID;
	this.drawing = $('#'+drawingID);
	this.context = this.drawing.get(0).getContext("2d");

	this.guideID = guideID;
	this.guide = $('#'+guideID);
	this.guide_context = this.guide.get(0).getContext("2d");

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
}
Sketcher.prototype.onCanvasMouseDown = function () {
	var self = this;
	return function(event) {
		self.dragging = true;
		self.clearCursor();
		self.mouseUpHandler = self.onCanvasMouseUp()

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
		self.dragging = false;
		$(document).unbind( self.mouseUpEvent, self.mouseUpHandler );
		
		self.mouseMoveHandler = null;
		self.mouseUpHandler = null;
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
	this.context.moveTo( this.lastMousePoint.x, this.lastMousePoint.y );
	this.updateMousePosition( event );
	this.context.lineTo( this.lastMousePoint.x, this.lastMousePoint.y );
	this.context.stroke();
}

Sketcher.prototype.updateCanvasByBrush = function (event) {
	var halfBrushW = this.brush.width/2;
	var halfBrushH = this.brush.height/2;
	
	var start = { x:this.lastMousePoint.x, y: this.lastMousePoint.y };
	this.updateMousePosition( event );
	var end = { x:this.lastMousePoint.x, y: this.lastMousePoint.y };
	
	var distance = parseInt( Trig.distanceBetween2Points( start, end ) );
	var angle = Trig.angleBetween2Points( start, end );
	
	var x,y;
	
	for ( var z=0; (z<=distance || z==0); z++ )
	{
		x = start.x + (Math.sin(angle) * z) - halfBrushW;
		y = start.y + (Math.cos(angle) * z) - halfBrushH;
		//console.log( x, y, angle, z );
		this.context.drawImage(this.brush, x, y);
	}
}

Sketcher.prototype.drawCursor = function(){
	this.clearCursor();
	this.top_canvas_context.beginPath();
	this.top_canvas_context.fillStyle = "purple"; //selectColor;
	this.top_canvas_context.arc(this.lastMousePoint.x, this.lastMousePoint.y, 4, 0 , 2 * Math.PI, false);
	this.top_canvas_context.fill();
}

Sketcher.prototype.clearCursor = function(){
	var c = this.top_canvas[0];
	this.top_canvas_context.clearRect( 0, 0, c.width, c.height );
}

Sketcher.prototype.toString = function () {

	var dataString = this.drawing.get(0).toDataURL("image/png");
	var index = dataString.indexOf( "," )+1;
	dataString = dataString.substring( index );
	
	return dataString;
}

Sketcher.prototype.toDataURL = function () {

	var dataString = this.drawing.get(0).toDataURL("image/png");
	return dataString;
}

Sketcher.prototype.clear = function () {

	var c = this.drawing[0];
	this.context.clearRect( 0, 0, c.width, c.height );
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
			