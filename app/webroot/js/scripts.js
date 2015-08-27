 // Create a wrapper for the entire app for closure
(function (w,d) {
	var twoPI = 2 * Math.PI,
		colors;
	var touchSupported = Modernizr.touch;
	w.gronsterApp = this;

	/*
	* Initialize the UI
	* @param filepath will be either local or on remote host
	* @param gronster is the gSketcher object created below
	*/
	this.initUI = function (filepath, gronster) {
		var working = false,
			currColor = 2, // current color starts out 'magenta', which is index 1 in colorsKey array
			currSize = 2, // current size is 'medium', which is 2 in sizesKey
			prevColor = 'purple';

		var colorsKey = ['magenta','blue','purple','green','orange','black','white'];
		var sizesKey = ['xsmall','small','medium','large','xlarge'];

		// Display the drawing controls here (non-js enabled browsers won't see them by default)
		$('.js-only').show();

		// Color controls
		$('.select-color').addClass(prevColor);
		
		//help text: not ready alert
		$('a#not-ready-button').click(function(e) {
			e.preventDefault();
  			$('#not-ready').fadeOut('slow');
		});

		// Hide intro help on first click and then stop checking for click
		$('#start-help').show();
		var mouseDownEvent;
		if(touchSupported){
			mouseDownEvent = 'touchstart';
		} else {
			mouseDownEvent = 'mousedown';
		}
		$('#canvases').bind(mouseDownEvent, function() {
		  $('#start-help .intro').fadeOut('fast', function() { $(this).remove(); });
		  $('canvas#top').removeClass('highlight');
		  $(this).unbind(mouseDownEvent);
		});
		
		// REVEAL MODAL **
		$('.intro').click(function(e) {
          	e.preventDefault();
          	$('#start-help').fadeOut('fast', function() { $(this).remove(); });
		  	$('#intro-help-modal').reveal();
     	});

     	// Remove the help text if user clicks on "x"
     	$('a.close').click(function(e){
     		e.preventDefault();
     		e.stopPropagation();
     		$('#start-help .intro').fadeOut('fast', function() { $(this).remove(); });
     	});

		/* USING CONTROLS */
		if(!touchSupported){
			$('.helpable').click(function(e){
				// CONTEXTUAL HELP
				// If user clicks button twice, give them a tool tip
				var submiturl = filepath + "/gronsters/checkControllerClicks";
				var formdata = {clicked:true};
				$.post(	submiturl, 
						formdata, 
						function(message) {
							console.log("me " + message.clicks);
	            			// If user has clicked twice, give them a bit of help
	            			if (message.clicks==5 ){
	            				var content = "<div class='tool-tip'><p class='cloud'>You can use your keyboard arrows to toggle through colors and brush sizes.</p><a href='#' id='close-tip' class='help-button'>I got it</a></div>";
	            				$(content).hide().appendTo('#start-help')
	            					.delay(300)
	            					.fadeIn('slow');
	            				$('#close-tip').click(function(e){
	            					$(this).parent().fadeOut(300, function() {$(this).remove(); });
	            				});
	            					// .delay(3000)
	            					// .fadeOut(500, function() { $(this).remove(); });
	            			};
	        			},
	        	 		"json");	
			});
 		}	

		// clear canvas on clicking the clear button
		$('#clear-button').click(function(e){
			if ($('#GronsterAddForm').length != 0){
				// user is working on the first part of drawing, so clear the entire canvas
				gronster.clear(gronster.drawing, gronster.context);
 			} else {
 				// user is working on second/third part, so don't clear the top
 				gronster.clearCanvas();
 			}
		})

		/* COLOR SELECTION */
		$('#color-button').click(function(e) {
			e.preventDefault();
			var $cbutton = $(this);
			if( !$(this).hasClass('open')) {
				$(this).addClass('open');
			}
			$('#colors').slideToggle("fast", function(){
				if ($(this).is(':hidden')) {
					$cbutton.removeClass('open');
				}
			});
		});

		$('ul#colors li').click(function() {
			var colorName = $(this).attr('class');
			gronster.setColor(colorName);
			setSelectColor(colorName);
			$('#color-button').trigger('click');
		});

		var setSelectColor = function(colorName){
			$('.select-color').removeClass(prevColor).addClass(colorName);//css('background', colorVal );
			prevColor = colorName;
		}

		/* BRUSH SIZE SELECTION */
		$('#size-button').click(function(e) {
			e.preventDefault();
			var $sbutton = $(this);
			if(!$(this).hasClass('open')) { // if this doesn't have the 'open' class, add it
				$(this).addClass('open');
			}
			$('#sizes').slideToggle('fast', function(){
				if ($(this).is(':hidden')) {
					$sbutton.removeClass('open');
				}
			});
		});

		$('ul#sizes li').click(function() {
			var sizeName = $(this).attr('class');
			setSelectSize(sizeName);
			$('#size-button').trigger('click');
		});

		var setSelectSize = function(sizeName){
			currSize = sizesKey.indexOf(sizeName);
			gronster.setSize(sizeName);
			$('#size-button .select-size').removeClass('xlarge large medium small xsmall').addClass('select-size ' + sizeName);
		}

		// Key press events (d is document)
		// left arrow
		$(d).keydown(function(e){
		    if (e.keyCode == 37) { 
		    	currSize = sizesKey.getPrev(currSize);
		    	setSelectSize(sizesKey[currSize]);
		      return false;
		    }
		});

		// right arrow
		$(d).keydown(function(e){
		    if (e.keyCode == 39) { 
		       currSize = sizesKey.getNext(currSize);
		    	 setSelectSize(sizesKey[currSize]);
		       return false;
		    }
		});

		// up arrow
		$(d).keydown(function(e){
		    if (e.keyCode == 38) { 
		        currColor = colorsKey.getPrev(currColor);
		        var colorName = colorsKey[currColor];
				gronster.setColor(colorName);
				setSelectColor(colorName);
				return false;
		    }
		});

		// down arrow
		$(d).keydown(function(e){
		    if (e.keyCode == 40) { 
		    	currColor = colorsKey.getNext(currColor);
		        var colorName = colorsKey[currColor];	
		        gronster.setColor(colorName);       
				setSelectColor(colorName);
		       	return false;
		    }
		});

		// enter key is 13

		/*
		* Override the Drawing submit button click event on drawing/add page.
		* Works with handleData() and ajaxSubmit() functions.
		*
		* @param bool $working sets whether submit is underway.
		*/
		$('#GronsterAddForm').submit(function(e){
			if (gronster.ready()){
				doSubmit($(this), e); 
			} else {
				displayNotReadyMessage();
			}
			e.preventDefault();
		});

		/**
		 * Override the Panel submit button click event on drawing/add page.
		 * Works with formReady(), handleData() and ajaxSubmit() functions.
		 *
		 * @param bool $working sets whether submit is underway.
		 */
		$('#GronsterViewForm').submit(function(e){	
			if (gronster.ready()){
				doSubmit($(this), e);
			} else {
				displayNotReadyMessage();
			}
			e.preventDefault();
	  	});

		/*
		* Display a message telling user they can't submit the form yet
		*/
		var displayNotReadyMessage = function(e){
			$('#not-ready').fadeIn("slow");
		}
		/*
		* Handle the submit function for both gronster add form and panel add form
		* @var e: event
		* @var submit_url: the action to handle submit. 
		* @var this: the form submit element.
		*/
		var doSubmit = function (form, e){
		  	if (formReady(e)) {
		  		$('canvas#top').unbind(mouseDownEvent);
		  		$('#controls').hide();
		  		$('.toggler').fadeOut('fast');
		  		/* AJAX LOADING DISPLAY */
				$("#loading").bind("ajaxStart", function(){
				  $(this).show().css("height",gronster.getHeight());
				}).bind("ajaxComplete", function(){
				  $(this).hide();
				})
		 		var submit_url = total == 0 ? filepath + "/gronsters/add" : filepath + "/panels/add";
		 		

		 		// PROBLEM ON IE
		 		// ie can get the image in a data format with toString(). 
		 		// What it can't do it serialize the form for some reason.

		 		var canvas = document.getElementById("drawing");
				var dataString = canvas.toDataURL("image/png");
	
	  			// get serialized formdata that includes image data
	  			// old way: var formdata = form.serialize() + "&img=" + gronster.toString();
	  			var formdata = form.serialize() + "&img=" + dataString;
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
		var formReady = function(e){
			e.preventDefault(); 
			// Make sure a submit isn't already underway.
			if(working) return false;
			working = true;
			$('#submit').val('Working..');
			$('span.error').remove();
			return true;
		}
		
		/**
		 * Override the submit button click event on drawing/add page.
		 * Works with handleData() and ajaxSubmit() functions.
		 *
		 * @param bool $working sets whether submit is underway.
		 */
		var ajaxSubmit = function(formdata, submiturl){
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
		    			// ajax load in the sharing screen:
		    			// $('#drawing-controls-container').fadeOut(300, function(){
		    			// 	$(this).load(filepath + "/gronsters/share/" + id + " #share-container > *", 
		    			// 		function(){
		    			// 			$(this).fadeIn(300);
		    			// 		});
		    			// });

						// var ht = $('#drawing-controls-container').height();
						// $('#drawing-controls-container').animate({
						// 	height: 0,
						// 	top: '-=100'
						// 	}, 300,function(){
		    // 					$(this).hide().load(filepath + "/gronsters/share/" + id + " #share-container > *", 
		    // 						function(){
		    // 							$(this).show().animate({
		    // 								height:ht,
		    // 								top:'+=100'		
		    // 							}, 300);
		    // 						});
		    // 			});
		    			//$('#drawing-controls-container').load(filepath + "/gronsters/share/" + id + " #share-container > *");
		    			window.location.replace(filepath + "/gronsters/share/" + id);
		    		}
		    		
		    	} else {
		    		alert("message: " + message.errors);
					  $.each(message.errors,function(k,v){

						  $('label[for='+k+']').append('<span class="error">'+v+'</span>');
					  });
				  }
			  },
			  error: function(jqXHR, textStatus, errorThrown) {
			  	alert("Oh, something bad just happened. Try again.");
			  }
		  });
		}; 
	};

	/*
	* Canvas is an object that handles displaying graphics on a canvas element.
	* It's the parent object of sketcher and gSketcher objects
	*
	* @param spec object containing a number of possible arguments.
	* { canvas: 
		{ listener: string element that we use to check draw events, 
		drawing: string element that we draw on, 
		cursor: string element that we draw cursor on.
		},
		brush: brush graphic,
		dimensions: 
		{
		width: 500,
		height:400
		},
		offset: 20
		};
	*/
	this.gSketcher = function( spec ){
		var that = this,
			started = false;
		that.eraser = false;
			/*
			* Set a variable to hold dimensions in an object
			*/
		that.dimensions = function(){ 
				var d = {},
					w, h;
				if (typeof spec.dimensions==='object'){
					d.width = spec.dimensions.width;
					d.height = spec.dimensions.height;
				} else {
					d.width = that.drawing.width();
					d.height = that.drawing.height();
				}
				return d;
			}();

		that.getWidth = function(){
				return that.dimensions.width;
		};

		that.getHeight = function(){
			return that.dimensions.height;
		};

		that.setCanvas = function( ){
			if (typeof spec.canvas ==='string') {
					that.drawing = $(spec.canvas);
				} else if (typeof spec.canvas ==='object') {
					that.drawing = $(spec.canvas.drawing);
				} else {
					that.drawing = null;// Make a canvas dynamically
				}
			that.context = that.drawing.get(0).getContext("2d");
		};

		that.checkCanvasSupport = function( ){
			var elem = document.createElement('canvas');
			return !!(elem.getContext && elem.getContext('2d'));
		};


		// SKETCHER METHODS

		that.onCanvasMouseDown = function(){
			var self = that;
			return function(event) {
				self.started = true;
				self.dragging = true;
				self.mouseUpHandler = self.onCanvasMouseUp();
				$(document).bind( self.mouseUpEvent, self.mouseUpHandler );
				self.updateMousePosition( event );
				self.renderFunction( event ); // i.e. updateCanvasByBrush() or updateCanvasByLine()
			}
		};


		that.onCanvasMouseMove = function( ){
			var self = that;
			return function(event) {
				if (self.dragging){
					self.renderFunction( event );
			    	event.preventDefault();
			    	self.drawCursor();
			    	return false;
				} else {
				  	self.updateMousePosition( event );
				  	self.drawCursor();
				}
			}
		};
		that.onCanvasMouseUp = function( ){
			var self = that;
			return function(event) {
				self.dragging = false;
				$(document).unbind( self.mouseUpEvent, self.mouseUpHandler );
				self.mouseMoveHandler = null;
				self.mouseUpHandler = null;
			}
		};
		that.onCanvasMouseLeave = function (event) {
			var self = that;
			return function(event) {
				self.clear(self.cursor, self.cursorContext);
			}
		};
		that.updateMousePosition = function (event) {
			var target;
			if (touchSupported) {
				target = event.originalEvent.touches[0];
			}
			else {
				target  = event;
			}
			var offset = that.topCanvas.offset();
			that.lastMousePoint.x = target.pageX - offset.left;
			that.lastMousePoint.y = target.pageY - offset.top;

		};
		that.updateCanvasByLine = function (event) {
			that.context.beginPath();
			that.context.lineWidth = 8;
			that.context.lineCap = 'round';
			that.context.moveTo( that.lastMousePoint.x, that.lastMousePoint.y );
			that.updateMousePosition( event );
			that.context.lineTo( that.lastMousePoint.x, that.lastMousePoint.y );
			that.context.stroke();
		};
		that.updateCanvasByBrush = function (event) {
			// Shortcuts to key variables
			var brushgraphic = that.brush.graphic,
				brushSize = that.brush.getSize(),
				brushX = that.brush.x,
				brushY = that.brush.y,
				halfBrushSize = that.brush.halfBrushSize,
				start = { x:that.lastMousePoint.x, y: that.lastMousePoint.y };

			that.updateMousePosition( event );

			var end = { x:that.lastMousePoint.x, y: that.lastMousePoint.y },
				distance = parseInt( gronsterApp.trig.distanceBetween2Points( start, end ) ),
				angle = gronsterApp.trig.angleBetween2Points( start, end ),
				x,y;

			for ( var z=0; (z<=distance || z==0); z++ )
			{
				x = start.x + (Math.sin(angle) * z) - halfBrushSize; // use halfBrushSize so we don't have to calc every time
				y = start.y + (Math.cos(angle) * z) - halfBrushSize;
				//context.drawImage(img,sx,sy,swidth,sheight,dx,dy,dwidth,dheight);
				that.context.drawImage(
					brushgraphic, brushX, brushY, brushSize, brushSize, x, y, brushSize, brushSize);
				//this.context.drawImage(brush, 45, 6, 9, 9, x ,y, 9, 9);
				//this.context.drawImage(brush, x,y);
			}
		};
		that.drawCursor = function(){
			var ctx = that.cursorContext;
			that.clear(that.cursor, ctx);
			if (that.eraser==true){
				ctx.lineWidth = 2;
				ctx.strokeStyle = "#cccccc";
			} 
			ctx.beginPath();
			ctx.fillStyle = that.brush.getColor(); //selectColor;
			ctx.arc(that.lastMousePoint.x, that.lastMousePoint.y, that.brush.halfBrushSize, 0 , twoPI, false); 
			// x, y, radius, start angle, end angle, clockwise
			ctx.fill();
			if (that.eraser) ctx.stroke();
		}

		/*
		* Update color of brush and of cursor by changing color in 
		* sketcher and in its multiBrush object.
		*/
		that.setColor = function(colorName){
			that.eraser = colorName == "white" ? true:false;
			that.brush.setColor(colorName);
			that.drawCursor();
		}

		that.setSize=function(size){
			that.brush.setSize(size);
			that.drawCursor();
		}

		that.clearCanvas = function(){
			that.clear(that.drawing, that.context, that.drawing.width(), that.drawing.height()-15, 0, 15);
		}

		that.clear = function(canvas, ctx, w, h, x, y){
			var wt = w ? w : canvas.width();
			var ht = h ? h : canvas.height();
			var x =  x ? x : 0;
			var y = y ? y : 0;
			ctx.clearRect(x, y, wt, ht);	
		}
		
		// gSKETCHER METHODS

		// Optional offset for cropping out part of the drawing
		that.offset = function(){ 
			return typeof spec.offset==='number' ?  spec.offset :  0;
		}();

		that.makeGuides = function(){
			if(typeof total != 'undefined'){

			    // Show whether artist should draw the top, middle or bottom
			    that.firstDraw = false;
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

		/*
		* Draw a dotted baseline to show what part of drawing will be passed
		* to the next drawer.
		*/
		that.drawBaseline = function(ctx) {
			var x = 0;
			var dashLength = 2;
			var coords = {};
			coords.x1 = 0;
			coords.y1 = that.topCanvas.height() - that.offset;
			coords.x2 = that.topCanvas.width();
			coords.y2 = coords.y1;
			var count = this.topCanvas.width()/(2*dashLength);
			that.drawDashedLine(dashLength, count, ctx, coords);
		}

		/*
		* Draw a dotted line
		* Make a series of rectangles with space to simulate a dotted line
		*/
		that.drawDashedLine = function(dashLength, count, ctx, coordsObj){
			var start = { x:coordsObj.x1, y:coordsObj.y1 },
				end = { x:coordsObj.x2, y:coordsObj.y2 },
				distance = parseInt( gronsterApp.trig.distanceBetween2Points( start, end ) ),
				angle = gronsterApp.trig.angleBetween2Points( start, end ),
				x,y;

			var dashSq = dashLength * dashLength;
			for ( var z=0; (z<=count || z==0); z++ )
			{
				x = start.x + (Math.sin(angle) * z) * dashSq; 
				y = start.y + (Math.cos(angle) * z);
				ctx.rect(x, y, dashLength, dashLength);
				ctx.fillStyle = '#a3a7e3';
				ctx.fill(); 
				
			}
		}

		that.toString = function () {
			// This is what the script said and it worked but not on ie:
			// var dataString = that.drawing.get(0).toDataURL("image/png");
			// var index = dataString.indexOf( "," )+1;
			// dataString = dataString.substring( index );
			// The following is based on example that should work on ie because it's from:
			// http://msdn.microsoft.com/en-us/library/ie/ff975241(v=vs.85).aspx
			var canvas = document.getElementById("drawing");
			var dataString = canvas.toDataURL("image/png");
			return dataString;
		}

		that.ready = function(){
			if(total<2){
				return that.checkDataOnCanvas(0, that.topCanvas.height() - that.offset, that.topCanvas.width(), that.offset);
			} else {
				return true;
			}
		}

		// Handle bottom of previous image for connecting the two panels
		that.loadPrevImage = function(src){
			var imageObj = new Image(); 
			var self = that;
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
		that.drawPrevImage = function (imageObj) {
			 // draw cropped image
			var sourceX = 0;
			var sourceY = that.drawing.height() - that.offset; 
			var sourceWidth = that.drawing.width(); 
			var sourceHeight = that.offset; 
			var destWidth = sourceWidth;
			var destHeight = sourceHeight;
			var destX = 0;
			var destY = 0;
			that.context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);   
		}

		/*
		* Scan through canvas to detect presence of drawing
		* If there isn't a drawing in the bottom area, alert user
		*/
		that.checkDataOnCanvas = function(x,y,w,h){
			var x = typeof x == 'number' ? x:0;
			var y = typeof y == 'number' ? y:0;
			var w = typeof x == 'number' ? w:0;
			var h = typeof h == 'number' ? h:0;
			var canvas  = that.drawing;
			var ctx     = that.context;
			var drawn   = false;
			var d       = ctx.getImageData(x, y, w, h); //image data 
			var len     = d.data.length;
			for(var i =0; i< len; i++) {
				if(!d.data[i]) {
				  drawn = false;
				} else if(d.data[i]) {
				  drawn = true;
				  break;
				}
			}
			return drawn;
		}

		that.init = function (){
			if (that.checkCanvasSupport()){
				that.setCanvas();
				that.lastMousePoint = {};
				if (touchSupported) {
					this.mouseDownEvent = "touchstart";
					this.mouseMoveEvent = "touchmove";
					this.mouseUpEvent = "touchend";
				}
				else {
					that.mouseDownEvent = "mousedown";
					that.mouseMoveEvent = "mousemove";
					that.mouseUpEvent = "mouseup";
					that.mouseLeaveEvent = 'mouseleave';
				}

				// Check if spec includes a brush
				if (spec.brush){
					that.brush = gronsterApp.multiBrush(spec.brush);
				}

				// Check if multibrush successfully instantiated with the brush file
				if (that.brush) {
					that.renderFunction = that.updateCanvasByBrush;
				} else {
					that.renderFunction = that.updateCanvasByLine;
				}

				// check if we should draw cursor
				if (spec.canvas && typeof spec.canvas.cursor==='string'){
					that.cursor = $(spec.canvas.cursor);
					that.cursorContext = that.cursor.get(0).getContext("2d");
				}
				
				// only bind to what is necessary
				if (typeof spec.canvas==='object' && typeof spec.canvas.listener ==='string'){
					that.topCanvas = $(spec.canvas.listener);
				} else {
					that.topCanvas = that.drawing;
				}
				that.topCanvas.bind( that.mouseDownEvent, that.onCanvasMouseDown() );
				that.topCanvas.bind( that.mouseMoveEvent, that.onCanvasMouseMove() );
				that.topCanvas.bind (that.mouseLeaveEvent, that.onCanvasMouseLeave() );

				// check if we should draw guideline
				if (spec.canvas && typeof spec.canvas.guide==='string'){
					if (spec.drawBaseline) {
						var guide = $(spec.canvas.guide);
						var ctx = guide.get(0).getContext("2d");
						that.drawBaseline(ctx);
					}
				}

				// Check if we should draw the top image 
				// Got to be a better way of handling this
				if (typeof topimage == 'string'){
					that.loadPrevImage(topimage);
				}
			} else {
				return;
				// no canvas support, so give alternate experience...
			}
		}();
		
		return that;
	}

	/*
	* A type of brush based on an image file with multiple distinct graphics.
	* By giving multiBrush the right coords, you can draw with any one of the 
	* graphics within the image file.
	*/
	this.multiBrush = function( spec ){
		var that = {};
		that.graphic = spec;

		that.sizeName = 'medium';
		that.colorName = 'purple';

		// map to the location of each color on the brushes graphic
		that.xIndex = dictionary({
			magenta:1,
			blue: 2,
			purple: 4,
			white: 6,
			green: 0,
			orange: 3,
			black: 5
		});
		that.yIndex = dictionary({
			xsmall: [6,58],
			small: [8, 50],
			medium: [10, 40],
			large: [16, 24],
			xlarge: [24, 0]
		});

		that.setColor = function(colorName){
			that.colorName = colorName;
			that.color = colors.lookup(colorName);
			that.update();
		}

		that.getColor=function(){
			return that.color;
		}

		/* Set the size and location of brush
		* @var brushSize is diameter of the brush
		* @var halfBrushSize is half. Calculated once so we don't have to do it every loop and mouse move.
		*/
		that.setSize=function(size){
			that.sizeName = size;
			that.brushSize = that.yIndex.lookup(size)[0]; // brushsize is first element of array
			that.halfBrushSize = that.brushSize / 2; 
			that.update();
		}

		that.getSize=function(){
			return that.brushSize;
		}

		/*
		* Change x,y coordinates so that the right brush will display
		* @var y is based on the y location of the color on brushes.png
		* @var x is based on the placement of color * brush size.
		*/
		that.update = function(){
			that.y = that.yIndex.lookup(that.sizeName)[1];
			that.x = that.brushSize * that.xIndex.lookup(that.colorName);
		}

		that.init = function(){
			that.setSize(that.sizeName);
			that.setColor(that.colorName); // Starting color;
			that.update();
		}( );

		return that;
	}
		// END BRUSH


	this.trig = {
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

	var dictionary = function(startValues){
		var that = {};

		that.init = function() {
			that.values = startValues || {};
		}( );

		that.store = function(name, value){
			this.values[name] = value;
		}
		that.lookup =function(name){
			return this.values[name];
		}
		return that;
	}

	// Define new methods
	Function.prototype.method = function (name, func){
		this.prototype[name] = func;
		return this;
	}

	Array.prototype.getNext = function(index) {
		var original = index; // don't cycle, just stop
		return ++index == this.length ? original : index;
	}

	Array.prototype.getPrev = function(index) {
		var original = index;
		return --index == -1 ? original : index;
	}

	Array.prototype.indexOf = function (vItem) {
	    for (var i=0; i < this.length; i++) {
	        if (vItem == this[i]) {
	            return i;
	        }
	    }
	    return -1;
	}

	this.init = function(spec){
		colors = dictionary({
			magenta:'#da0587',
			blue: '#290fcd',
			purple: '#5d07be',
			white: '#fff',
			green: '#318603',
			orange: '#ee5205',
			black: '#000000'
		});
		gronster = gSketcher(spec);
		initUI(spec.filepath, gronster);
	}
		
}(this, document));

