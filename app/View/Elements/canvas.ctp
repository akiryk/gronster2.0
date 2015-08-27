<!-- ********************************************************** -->
<!-- *********************  CANVAS     ************************ -->
<!-- ********************************************************** -->
<div id="canvases">
  	<div id="no-js-info">
  		<p>It looks like you don't have javascript enabled, which means you won't be able to draw with this application.</p>
	  	<p> No worries! You can still 
	  	<?php echo $this->Html->link(
	  		'look at drawings others have made',
	  		array('controller' => 'gronsters', 'action' => 'index')); ?>
	  	(or you might be able to <a href="http://enable-javascript.com/">enable javascript</a>).</p>
	</div>
	<canvas id="drawing" width=<?php echo WIDTH ?> height=<?php echo HEIGHT ?>></canvas>
	<canvas id="guide" width=<?php echo WIDTH ?> height=<?php echo HEIGHT ?>></canvas>
	<canvas id="top" class="highlight" width=<?php echo WIDTH ?> height=<?php echo HEIGHT ?>></canvas>
	<div id="not-ready" class="big-help">
		<p class="cloud">You need to draw connecting lines down here...</p>
		<a href="#" id="not-ready-button" class="help-button">Okay</a>
	</div>
	<div id="loading"></div>
	<div id="start-help">
		<!-- Explain whether to draw head, body, or legs -->
		<div class="intro">
			<div class="intro-text">
			<?php print $start_message; ?>
			<div id="help-actions">
				<div id="more-help-button">Confused? Click for help.</div>
			</div>
		</div><!-- intro text -->
		</div><!-- .intro -->
	</div>
</div> <!-- #canvases -->
<div id="shadow"></div>