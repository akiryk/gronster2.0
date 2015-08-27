$(document).ready(function(e){
	// auto focus on the right fields at right times
	$userFromMsg = $("input#UserFrom").val();
	$userToMsg = $("input#UserTo").val();
	$name = $("input#UserFirstname").val();

	$("input#UserFirstname").focus(function(){
		if($(this).val() == $name){
			$(this).val("");
		}
	});
	$("input#UserFrom").focus(function(){
		if($(this).val() == $userFromMsg){
			$(this).val("");
		}
	});
	$("input#UserTo").focus(function(){
		if($(this).val()==$userToMsg){
			$(this).val("");
		}
	});
	$("input#UserFirstname").blur(function(){
		if($(this).val()==""){
			$(this).val($name);
		} else {
			$(this).addClass('completed');
		}
	});
	$("input#UserFrom").blur(function(){
		if($(this).val()==""){
			$(this).val($userFromMsg);
		} else {
			$(this).addClass('completed');
		}
	});
	$("input#UserTo").blur(function(){
		if($(this).val()==""){
			$(this).val($userToMsg);
		} else {
			$(this).addClass('completed');
		}
	});
});